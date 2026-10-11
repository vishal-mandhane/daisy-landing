// End-to-end: load the real extension into Chromium, drive fixture pages that
// mirror each site's DOM, and assert what a user would see. No network beyond
// 127.0.0.1 (a mock OMDb lives in this file).
import { chromium } from 'playwright';
import http from 'node:http';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(root, 'e2e', '.tmp');
const extDir = path.join(tmp, 'ext');
const profileDir = path.join(tmp, 'profile');

// --- 1. Test build of the extension: allow http://127.0.0.1 so fixtures get the content script.
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
cpSync(path.join(root, 'extension'), extDir, { recursive: true });
const manifest = JSON.parse(readFileSync(path.join(extDir, 'manifest.json'), 'utf8'));
manifest.content_scripts[0].matches.push('http://127.0.0.1/*');
manifest.host_permissions.push('http://127.0.0.1/*');
writeFileSync(path.join(extDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
const vendored = existsSync(path.join(extDir, 'vendor', 'transformers.min.js'));

// --- 2. Fixture server + mock OMDb.
const OMDB = {
  inception: { Title: 'Inception', Year: '2010', Type: 'movie', imdbID: 'tt1375666', imdbRating: '8.8', imdbVotes: '2,500,000', Ratings: [{ Source: 'Rotten Tomatoes', Value: '87%' }], Response: 'True' },
  'the room': { Title: 'The Room', Year: '2003', Type: 'movie', imdbID: 'tt0368226', imdbRating: '3.6', imdbVotes: '100,000', Ratings: [{ Source: 'Rotten Tomatoes', Value: '24%' }], Response: 'True' },
  'stranger things': { Title: 'Stranger Things', Year: '2016–', Type: 'series', imdbID: 'tt4574334', imdbRating: '8.7', imdbVotes: '1,300,000', Ratings: [{ Source: 'Rotten Tomatoes', Value: '92%' }], Response: 'True' },
};
let omdbCalls = 0;
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  res.setHeader('access-control-allow-origin', '*');
  if (u.pathname.startsWith('/omdb')) {
    omdbCalls++;
    const t = (u.searchParams.get('t') ?? '').toLowerCase();
    const hit = OMDB[t];
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(hit ?? { Response: 'False', Error: 'Movie not found!' }));
    return;
  }
  const file = path.join(root, 'e2e', 'fixtures', path.basename(u.pathname));
  if (!existsSync(file)) {
    res.statusCode = 404;
    res.end('nope');
    return;
  }
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// --- 3. Browser with the extension.
const context = await chromium.launchPersistentContext(profileDir, {
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : { channel: 'chromium' }),
  headless: true,
  args: [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`],
});
let sw = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
// The worker handle exists before its script has run; wait until the API surface is there.
for (let i = 0; i < 50; i++) {
  sw = context.serviceWorkers()[0] ?? sw;
  const ready = await sw.evaluate(() => typeof chrome !== 'undefined' && Boolean(chrome.storage)).catch(() => false);
  if (ready) break;
  await new Promise((r) => setTimeout(r, 200));
}
const extId = new URL(sw.url()).host;
const results = [];
const notes = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(`ok   ${name}`);
  } catch (err) {
    results.push(`FAIL ${name}\n     ${String(err.message ?? err).split('\n').join('\n     ')}`);
  }
};
const setSettings = (patch) => sw.evaluate(async (patch) => {
  const { 'sieve.settings': cur } = await chrome.storage.sync.get('sieve.settings');
  const merge = (a, b) => {
    const o = { ...(a ?? {}) };
    for (const [k, v] of Object.entries(b)) o[k] = v && typeof v === 'object' && !Array.isArray(v) ? merge(a?.[k], v) : v;
    return o;
  };
  await chrome.storage.sync.set({ 'sieve.settings': merge(cur, patch) });
}, patch);
// Content scripts live in an isolated world, so the test reads DOM attributes, not JS expandos.
const expectState = (s, title, state, why = '') => assert.equal(s[title], state, `${title} should be ${state}${why ? ` (${why})` : ''}; got ${JSON.stringify(s)}`);
const states = (page) => page.evaluate(() => {
  const out = {};
  for (const el of document.querySelectorAll('[data-sieve-title]')) out[el.dataset.sieveTitle] = el.dataset.sieve ?? 'show';
  return out;
});

try {
  // ---------- Topic lens on YouTube ----------
  await step('topic lens hides non-matching cards with keyword engine', async () => {
    // Keyword engine only: literal (stemmed) matches. "investing" also catches "invest".
    await setSettings({ topics: { enabled: true, query: 'investing, mutual funds, stock market -crypto', presets: [], action: 'hide', engine: 'keyword' } });
    const page = await context.newPage();
    await page.goto(`${base}/youtube.html`);
    await page.waitForSelector('[data-sieve="hide"]', { state: 'attached', timeout: 10000 });
    await page.waitForTimeout(400);
    const s = await states(page);
    expectState(s, 'How I invest my salary every month (SIP + index funds)', 'show');
    expectState(s, 'Best mutual funds for 2026 — full breakdown', 'show');
    expectState(s, 'Stock market crash explained', 'show', 'lockup inside rich item');
    expectState(s, 'Minecraft speedrun world record 2026', 'hide');
    expectState(s, 'Why Bitcoin and crypto will 10x your money', 'hide', 'excluded by -crypto');
    expectState(s, 'Thailand travel vlog: Chiang Mai street food', 'hide');
    expectState(s, 'Top 10 funniest cat videos', 'hide', 'standalone lockup');
    expectState(s, 'Learn Python in 1 hour', 'hide');
    assert.equal(Object.keys(s).length, 8, 'eight cards, nested lockup not double counted');

    // Lazy-loaded cards are judged too.
    await page.click('#more');
    await page.waitForFunction(() => Object.keys(document.querySelectorAll('ytd-rich-item-renderer')).length >= 8);
    await page.waitForTimeout(500);
    const s2 = await states(page);
    expectState(s2, 'Warren Buffett on investing in index funds', 'show');
    expectState(s2, 'Fortnite chapter 7 gameplay', 'hide');

    // Switching to Dim re-applies without reload; switching the lens off restores everything.
    await setSettings({ topics: { action: 'dim' } });
    await page.waitForSelector('[data-sieve="dim"]', { state: 'attached', timeout: 5000 });
    expectState(await states(page), 'Fortnite chapter 7 gameplay', 'dim');
    await setSettings({ topics: { enabled: false } });
    await page.waitForFunction(() => !document.querySelector('[data-sieve]'), null, { timeout: 5000 });
    await page.close();
  });

  await step('preset chips + scope: channel pages are left alone by default', async () => {
    await setSettings({ topics: { enabled: true, query: '', presets: ['gaming'], action: 'hide', engine: 'keyword' } });
    const page = await context.newPage();
    await page.goto(`${base}/youtube.html`);
    await page.waitForSelector('[data-sieve="hide"]', { state: 'attached', timeout: 10000 });
    await page.waitForTimeout(300);
    const s = await states(page);
    expectState(s, 'Minecraft speedrun world record 2026', 'show');
    expectState(s, 'How I invest my salary every month (SIP + index funds)', 'hide');
    await page.close();
  });

  await step('floating toolbar renders in a shadow root and edits settings', async () => {
    const page = await context.newPage();
    await page.goto(`${base}/youtube.html`);
    await page.waitForSelector('#sieve-root');
    const pillText = await page.evaluate(() => document.querySelector('#sieve-root').shadowRoot.querySelector('.pill').textContent);
    assert.match(pillText, /Sieve/);
    await page.evaluate(() => document.querySelector('#sieve-root').shadowRoot.querySelector('.pill').click());
    await page.waitForFunction(() => document.querySelector('#sieve-root').shadowRoot.querySelector('.wrap.open'));
    const hasPanel = await page.evaluate(() => Boolean(document.querySelector('#sieve-root').shadowRoot.querySelector('.s-panel [data-query]')));
    assert.ok(hasPanel, 'panel with query input');
    await page.evaluate(() => {
      const chip = document.querySelector('#sieve-root').shadowRoot.querySelector('[data-preset="ai"]');
      chip.click();
    });
    await page.waitForFunction(async () => {
      const { 'sieve.settings': s } = await chrome.storage.sync.get('sieve.settings');
      return s.topics.presets.includes('ai');
    }, null, { timeout: 5000 }).catch(() => {});
    const saved = await sw.evaluate(async () => (await chrome.storage.sync.get('sieve.settings'))['sieve.settings'].topics.presets);
    assert.ok(saved.includes('ai'), `presets now ${JSON.stringify(saved)}`);
    await page.close();
  });

  // ---------- Ratings lens on Netflix ----------
  await step('ratings lens shows badges and dims low-rated titles (mock OMDb)', async () => {
    await setSettings({
      // Topic lens stays on with a query: it must NOT touch Netflix unless switched on for that site.
      topics: { enabled: true, query: 'investing', presets: [], sites: {} },
      ratings: { enabled: true, provider: 'omdb', keys: { omdb: 'test' }, endpoints: { omdb: `${base}/omdb/` }, minImdb: 7, action: 'hide', showBadges: true, hideUnrated: false },
    });
    await sw.evaluate(() => chrome.storage.local.clear());
    const page = await context.newPage();
    await page.goto(`${base}/netflix.html`);
    await page.waitForFunction(() => [...document.querySelectorAll('.sieve-badge')].some((b) => /IMDb/.test(b.textContent)), null, { timeout: 10000 });
    await page.waitForTimeout(600);
    const badges = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.title-card')].map((c) => [c.querySelector('a').getAttribute('aria-label'), c.querySelector('.sieve-badge')?.textContent ?? null])));
    assert.equal(badges['Inception'], 'IMDb 8.8 · RT 87%');
    assert.equal(badges['The Room'], 'IMDb 3.6 · RT 24%');
    assert.equal(badges['Stranger Things: Season 4'], 'IMDb 8.7 · RT 92%', 'season suffix stripped before lookup');
    assert.equal(badges['Unknown Film (2031)'], 'n/a');
    const s = await states(page);
    expectState(s, 'The Room', 'dim', 'hide downgrades to dim on Netflix (slider layout)');
    expectState(s, 'Inception', 'show');
    expectState(s, 'Unknown Film', 'show', 'unrated stays visible by default');
    const callsBefore = omdbCalls;
    assert.ok(callsBefore >= 4 && callsBefore <= 8, `omdb calls ${callsBefore}`);

    // Threshold change re-renders from cache, no new network.
    await setSettings({ ratings: { minImdb: 9, hideUnrated: true } });
    await page.waitForFunction(() => document.querySelectorAll('[data-sieve="dim"]').length >= 3, null, { timeout: 5000 });
    assert.equal(omdbCalls, callsBefore, 'no extra provider calls after threshold change');
    const s2 = await states(page);
    expectState(s2, 'Inception', 'dim');
    expectState(s2, 'Unknown Film', 'dim', 'hideUnrated');
    await page.close();
  });

  await step('ratings lens explains a missing key instead of failing silently', async () => {
    await setSettings({ ratings: { keys: { omdb: '' }, minImdb: 0, hideUnrated: false } });
    const page = await context.newPage();
    await page.goto(`${base}/netflix.html`);
    await page.waitForSelector('.sieve-badge', { timeout: 10000 });
    const txt = await page.evaluate(() => document.querySelector('.sieve-badge').textContent);
    assert.equal(txt, '★ key?');
    await page.close();
  });

  // ---------- Extension pages ----------
  await step('popup and options pages render', async () => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extId}/popup/popup.html`);
    await popup.waitForSelector('.s-panel');
    assert.match(await popup.textContent('.s-panel'), /Topics/);
    await popup.close();
    const options = await context.newPage();
    const errors = [];
    options.on('pageerror', (e) => errors.push(e.message));
    await options.goto(`chrome-extension://${extId}/options/options.html`);
    await options.waitForSelector('#site-list label');
    assert.equal(await options.locator('#site-list label').count(), 8);
    assert.deepEqual(errors, []);
    await options.close();
  });

  await step(`embedding engine ${vendored ? 'is installed and the vendored library loads' : 'reports not installed'}`, async () => {
    const status = await sw.evaluate(async () => {
      const api = chrome;
      return new Promise((resolve) => api.runtime.sendMessage({ type: 'engines.status' }, resolve));
    }).catch(() => null);
    // runtime.sendMessage from the SW to itself is not delivered; call the handler path via a page instead.
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extId}/popup/popup.html`);
    const st = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'engines.status' }));
    assert.equal(st.embedding.installed, vendored, JSON.stringify(st.embedding));
    if (vendored) {
      const warm = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'embedding.warm' }));
      // Offline here: the library must load (import succeeds) and then fail on the model download, not before.
      const msg = warm?.__error ?? warm?.error ?? '';
      assert.ok(!/not installed/.test(msg), `library failed to import: ${msg}`);
      assert.ok(warm?.ready || /download|offline|network/i.test(msg), `unexpected: ${JSON.stringify(warm)}`);
      notes.push(`embedding warm result: ${warm?.ready ? `ready on ${warm.device}` : msg}`);
    }
    await page.close();
    void status;
  });
} finally {
  await context.close();
  server.close();
}

console.log(results.join('\n'));
for (const n of notes) console.log(`note: ${n}`);
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed}/${results.length} e2e steps passed`);
process.exit(failed ? 1 : 0);
