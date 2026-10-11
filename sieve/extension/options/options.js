import { api, storageArea } from '../lib/browser.js';
import { createSettingsStore, sanitizeSettings } from '../lib/settings.js';
import { ADAPTERS } from '../sites/index.js';
import { LOGO_SVG } from '../ui/logo.js';
import { normalize } from '../lib/text.js';

const store = createSettingsStore(storageArea('sync'), {
  onChange: (cb) => api.storage.onChanged.addListener((changes, area) => area === 'sync' && cb(changes)),
});
const $ = (sel) => document.querySelector(sel);
const send = async (msg) => {
  const res = await api.runtime.sendMessage(msg);
  if (res?.__error) throw new Error(res.__error);
  return res;
};
const getPath = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const patchFor = (path, value) => {
  const out = {};
  let cur = out;
  const parts = path.split('.');
  parts.forEach((p, i) => {
    cur[p] = i === parts.length - 1 ? value : {};
    cur = cur[p];
  });
  return out;
};

function fill() {
  const s = store.get();
  document.querySelectorAll('[data-set]').forEach((input) => {
    const v = getPath(s, input.dataset.set);
    if (input.type === 'checkbox') input.checked = Boolean(v);
    else input.value = v ?? '';
  });
  document.querySelectorAll('[data-show]').forEach((el) => (el.hidden = el.dataset.show !== s.ratings.provider));
  document.querySelectorAll('[data-show-llm]').forEach((el) => (el.hidden = el.dataset.showLlm !== s.topics.llm.provider));
  renderCustom(s);
  renderSites(s);
}

function wire() {
  document.querySelectorAll('[data-set]').forEach((input) => {
    input.addEventListener('change', () => {
      const v = input.type === 'checkbox' ? input.checked : input.value.trim();
      store.save(patchFor(input.dataset.set, v)).then(fill);
    });
  });
}

function renderSites(s) {
  const list = $('#site-list');
  list.innerHTML = ADAPTERS.map((a) => `<label class="o-inline"><input type="checkbox" class="s-check" data-site="${a.id}" ${s.sites[a.id] !== false ? 'checked' : ''}> ${a.label}</label>`).join('');
  list.querySelectorAll('[data-site]').forEach((cb) => cb.addEventListener('change', () => store.save({ sites: { [cb.dataset.site]: cb.checked } })));
}

function renderCustom(s) {
  const list = $('#custom-list');
  if (!s.customPresets.length) {
    list.innerHTML = '<p class="s-muted">No custom presets yet.</p>';
    return;
  }
  list.innerHTML = s.customPresets
    .map((p) => `<div class="o-preset"><b>${esc(p.label)}</b><span class="s-muted">${esc((p.keywords ?? []).slice(0, 6).join(', '))}${(p.keywords ?? []).length > 6 ? '…' : ''}</span><span class="s-spacer"></span><button class="s-btn" data-del="${esc(p.id)}">Remove</button></div>`)
    .join('');
  list.querySelectorAll('[data-del]').forEach((b) =>
    b.addEventListener('click', async () => {
      const cur = store.get();
      await store.save({ customPresets: cur.customPresets.filter((p) => p.id !== b.dataset.del), topics: { presets: cur.topics.presets.filter((id) => id !== b.dataset.del) } });
      fill();
    }),
  );
}

const esc = (x) => String(x ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function main() {
  await store.load();
  $('#logo').innerHTML = LOGO_SVG;
  wire();
  fill();
  store.subscribe(fill);

  $('#cp-add').addEventListener('click', async () => {
    const label = $('#cp-label').value.trim();
    const keywords = $('#cp-keywords').value.split(/[,\n]/).map((k) => normalize(k)).filter(Boolean);
    const phrases = $('#cp-phrases').value.split(/[;\n]/).map((k) => k.trim()).filter(Boolean);
    if (!label || (!keywords.length && !phrases.length)) return;
    const id = 'custom-' + normalize(label).replace(/\s+/g, '-') + '-' + Date.now().toString(36);
    const cur = store.get();
    await store.save({ customPresets: [...cur.customPresets, { id, label, emoji: '✦', keywords, phrases: phrases.length ? phrases : [label] }] });
    $('#cp-label').value = $('#cp-keywords').value = $('#cp-phrases').value = '';
    fill();
  });

  $('#test-ratings').addEventListener('click', async () => {
    const out = $('#ratings-result');
    out.textContent = 'Looking up Inception (2010)…';
    try {
      const { rating, error } = await send({ type: 'ratings.test' });
      if (rating && !rating.unrated) out.innerHTML = `<span class="s-good">OK — Inception: ${esc(rating.imdb ?? rating.tmdb)} ${rating.rt != null ? `· RT ${rating.rt}%` : ''}</span>`;
      else out.innerHTML = `<span class="s-bad">Failed: ${esc(error?.message ?? 'no rating returned')}</span>`;
    } catch (err) {
      out.innerHTML = `<span class="s-bad">${esc(err.message)}</span>`;
    }
  });

  $('#warm-embedding').addEventListener('click', async () => {
    const out = $('#embedding-result');
    out.textContent = 'Loading model… first time downloads it from huggingface.co';
    try {
      const st = await send({ type: 'embedding.warm' });
      out.innerHTML = st.ready ? `<span class="s-good">Ready on ${esc(st.device)} — ${esc(st.model)}</span>` : `<span class="s-bad">${esc(st.error ?? 'not ready')}</span>`;
      notifyTabs();
    } catch (err) {
      out.innerHTML = `<span class="s-bad">${esc(err.message)}</span>`;
    }
  });

  $('#test-llm').addEventListener('click', async () => {
    const out = $('#llm-result');
    out.textContent = 'Asking the model to classify two sample titles…';
    try {
      if (store.get().topics.llm.provider === 'ollama') await requestLocalhost();
      const r = await send({ type: 'llm.test' });
      out.innerHTML = r.ok ? `<span class="s-good">OK — replied ${esc(JSON.stringify(r.out))} (expected [1,0])</span>` : `<span class="s-bad">Model replied but not in the expected format</span>`;
      notifyTabs();
    } catch (err) {
      out.innerHTML = `<span class="s-bad">${esc(err.message)}. Is Ollama running? Try <code>ollama serve</code>.</span>`;
    }
  });

  $('#clear-cache').addEventListener('click', async () => {
    const r = await send({ type: 'cache.clear' });
    $('#data-result').textContent = `Cleared ${r.ratings} ratings and ${r.topics} topic decisions.`;
    refreshCacheStats();
  });
  $('#export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store.get(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sieve-settings.json';
    a.click();
  });
  $('#import').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      await store.replace(sanitizeSettings(json));
      $('#data-result').textContent = 'Settings imported.';
      fill();
    } catch (err) {
      $('#data-result').textContent = `Import failed: ${err.message}`;
    }
  });
  refreshCacheStats();
}

async function refreshCacheStats() {
  try {
    const st = await send({ type: 'cache.stats' });
    $('#cache-stats').textContent = `Cached: ${st.ratings} ratings, ${st.topics} topic decisions. Ratings expire after 3 weeks, topic decisions after a week.`;
  } catch {
    $('#cache-stats').textContent = '';
  }
}

async function requestLocalhost() {
  if (!api.permissions?.request) return;
  try {
    await api.permissions.request({ origins: ['http://localhost/*', 'http://127.0.0.1/*'] });
  } catch {
    /* Ollama allows extension origins via CORS anyway */
  }
}

function notifyTabs() {
  api.tabs.query({}).then((tabs) => tabs.forEach((t) => t.id && api.tabs.sendMessage(t.id, { type: 'engines.changed' }).catch(() => {})));
}

main();
