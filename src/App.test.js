import { render, screen, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import App from './App';
import { formatCountdown } from './components/StoreBadges';
import { FAQ } from './data';
import { PAGES, ROUTES, headTags, llmsTxt, sitemapXml, structuredData } from './seo';
import { APP_STORE_ID, APP_STORE_LIVE, APP_STORE_URL, PLAY_STORE_URL } from './stores';

function renderAt(path) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

beforeAll(() => {
  // jsdom has no media playback
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
});

test('home opens on the store badges at #download, which every "Download Dayzi" link reaches', () => {
  renderAt('/');
  const hero = screen.getByRole('heading', { level: 1, name: /stop missing out/i }).closest('section');
  expect(hero).toHaveAttribute('id', 'download');
  expect(within(hero).getByRole('link', { name: 'Get it on Google Play' })).toHaveAttribute('href', PLAY_STORE_URL);
  expect(document.querySelectorAll('main form')).toHaveLength(0);
  const links = screen.getAllByRole('link', { name: /download dayzi/i });
  expect(links).toHaveLength(2); // the nav and the safety strip
  links.forEach((link) => expect(link).toHaveAttribute('href', '/#download'));
});

// The App Store page 404s until launch day, so until APP_STORE_LIVE the badge
// is not a link and says when.
test('the App Store badge is a link only once the app is in the App Store', () => {
  renderAt('/');
  const hero = document.getElementById('download');
  const badge = within(hero).getByRole('img', { name: 'Download on the App Store' });
  if (APP_STORE_LIVE) {
    expect(badge.closest('a')).toHaveAttribute('href', APP_STORE_URL);
  } else {
    expect(badge.closest('a')).toBeNull();
    expect(hero).toHaveTextContent('Coming 10 Nov');
  }
});

test('the countdown reads days, hours, minutes and seconds', () => {
  expect(formatCountdown(((2 * 24 + 21) * 3600 + 14 * 60 + 5) * 1000)).toBe('2d 21h 14m 05s');
  expect(formatCountdown((3 * 3600 + 7) * 1000 + 999)).toBe('03h 00m 07s');
  expect(formatCountdown(-1000)).toBe('00h 00m 00s');
  // Reduced motion: minutes, no ticking seconds.
  expect(formatCountdown(((2 * 24 + 21) * 3600 + 14 * 60 + 5) * 1000, { seconds: false })).toBe('2d 21h 14m');
});

// Each badge gets its own caption until launch day, so "Free · 18+" never
// floats under the pair on its own.
test('each badge carries its own caption until launch day', () => {
  renderAt('/');
  const hero = document.getElementById('download');
  if (APP_STORE_LIVE) {
    expect(hero).toHaveTextContent('Free · 18+');
    expect(hero).not.toHaveTextContent(/coming/i);
  } else {
    const [play, apple] = hero.querySelectorAll('.store');
    expect(play).toHaveTextContent('Free · 18+');
    expect(within(play).getByRole('link', { name: 'Get it on Google Play' })).toBeInTheDocument();
    expect(apple).toHaveTextContent('Coming 10 Nov');
  }
});

test.each(ROUTES.filter((r) => r !== '/'))('%s ends with the store badges at #download', (route) => {
  renderAt(route);
  expect(document.querySelectorAll('[id="download"]')).toHaveLength(1);
  const cta = document.getElementById('download');
  expect(within(cta).getByRole('link', { name: 'Get it on Google Play' })).toHaveAttribute('href', PLAY_STORE_URL);
  expect(document.querySelectorAll('main form')).toHaveLength(0);
});

// #join was the waitlist form; old links to it (bios, posts) land on the badges.
test('old #join links land on the store badges', async () => {
  const scrolled = [];
  window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {
    scrolled.push(this.id);
  };
  try {
    renderAt('/#join');
    await waitFor(() => expect(scrolled).toContain('download'));
  } finally {
    delete window.HTMLElement.prototype.scrollIntoView;
    window.history.pushState({}, '', '/');
  }
});

// Someone searching "dayzi" should find the name in the first screen, not
// only in the logo.
test('home names Dayzi right above the h1', () => {
  renderAt('/');
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1.previousElementSibling).toHaveTextContent(/^Dayzi\b/);
});

test('home keeps the videos: the hero film and one clip per step', () => {
  renderAt('/');
  const sources = [...document.querySelectorAll('main video')].map((v) => v.getAttribute('src'));
  expect(sources).toEqual(['/app/film-home.mp4', '/app/nearby.mp4', '/app/details.mp4', '/app/going.mp4']);
});

test.each([
  ['/how-it-works', /the tour/i],
  ['/safety', /show up safe/i],
  ['/faq', /good questions/i],
  ['/things-to-do-in-mumbai', /things to do in mumbai/i],
  ['/weekend-plans-in-mumbai', /what to do on weekends in mumbai/i],
  ['/things-to-do-with-friends', /things to do with friends/i],
  ['/no-one-to-go-with', /friends bailed/i],
  ['/meet-locals', /new in town/i],
])('%s renders its page', (path, heading) => {
  renderAt(path);
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});

// Every page is one tap from the nav (phone menu and laptop bar alike).
test('the nav links to every page, with the guides under Guides', () => {
  renderAt('/');
  const nav = screen.getByRole('navigation', { name: 'Main' });
  const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'));
  ROUTES.filter((r) => r !== '/').forEach((route) => expect(hrefs).toContain(route));
  expect(within(nav).getByRole('button', { name: /guides/i })).toHaveAttribute('aria-expanded', 'false');
  expect(document.getElementById('how-it-works')).toBeInTheDocument();
  expect(document.getElementById('safety')).toBeInTheDocument();
});

// The home page is the one-look version. Detail belongs on /how-it-works,
// /safety and /faq; if this fails, move copy there instead of raising the cap.
test('home stays short: at most 80 visible words', () => {
  renderAt('/');
  const main = document.querySelector('main').cloneNode(true);
  main.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
  const words = main.textContent.split(/\s+/).filter(Boolean);
  expect(words.length).toBeLessThanOrEqual(80);
});

// The films came from a series ("Dayzi, explained", episodes 02 and 03) whose
// numbers mean nothing on the site, where there is no episode 01.
test.each(['/', '/how-it-works', '/safety', '/faq'])('%s has no episode numbers', (path) => {
  renderAt(path);
  const labels = [...document.querySelectorAll('[aria-label]')].map((el) => el.getAttribute('aria-label'));
  expect([document.body.textContent, ...labels].join(' ')).not.toMatch(/\bep\.|episode|nº/i);
});

test('unknown paths fall back to home', () => {
  renderAt('/nope');
  expect(screen.getByRole('heading', { level: 1, name: /stop missing out/i })).toBeInTheDocument();
});

// ---------- What search engines and AI assistants read (seo.js) ----------

test('every page has its own title (60 chars max) and description (160 max)', () => {
  const titles = ROUTES.map((r) => PAGES[r].title);
  const descriptions = ROUTES.map((r) => PAGES[r].description);
  expect(new Set(titles).size).toBe(ROUTES.length);
  expect(new Set(descriptions).size).toBe(ROUTES.length);
  titles.forEach((t) => expect(t.length).toBeLessThanOrEqual(60));
  descriptions.forEach((d) => {
    expect(d.length).toBeGreaterThanOrEqual(70);
    expect(d.length).toBeLessThanOrEqual(160);
  });
});

test.each(ROUTES)('%s renders on the server, the way the prerender does', (route) => {
  const html = renderToString(<App initialPath={route} />);
  expect(html).toContain('<h1');
  expect(headTags(route)).toContain(`<link rel="canonical" href="https://dayzi.live${route === '/' ? '/' : route}">`);
});

test('every page except home has a rewrite to its prerendered file in vercel.json', () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  ROUTES.filter((r) => r !== '/').forEach((route) => {
    expect(vercel.rewrites).toContainEqual({ source: route, destination: `${route}/index.html` });
  });
});

test('the FAQ structured data carries every question on the page', () => {
  const page = structuredData('/faq')['@graph'].find((node) => node.mainEntity);
  expect(page.mainEntity.map((q) => q.name)).toEqual(FAQ.map((f) => f.q));
  expect(sitemapXml()).toContain('<loc>https://dayzi.live/faq</loc>');
});

// Everything the site says, rendered and generated, in one string.
function everything() {
  const pages = ROUTES.map((route) => renderToString(<App initialPath={route} />) + headTags(route));
  return [...pages, llmsTxt()].join(' ');
}

// Trademark safety: no other company's name, visible or hidden.
test('no competitor brand names anywhere on the site', () => {
  // \b, so a brand name inside a longer word doesn't count.
  const brands = /\b(Timeleft|Meetup|Bumble|BookMyShow|Zomato|Eventbrite|Partiful|AllEvents|HighApe|Sort My Scene|SkillBox|Urbanaut|Playo|Tinder|Hinge|FRND)\b/;
  expect('EventMeetupSocialNetworkingPlatform').not.toMatch(brands);
  expect('Meetup').toMatch(brands);
  expect(everything()).not.toMatch(brands);
});

// The store links live in stores.js and nowhere else in the app, so launch
// day is one switch (APP_STORE_LIVE). Until then the App Store link appears
// nowhere: it 404s.
test('store links come from stores.js, and the App Store link waits for launch day', () => {
  const all = everything();
  expect(all).toContain(PLAY_STORE_URL);
  if (!APP_STORE_LIVE) expect(all).not.toContain('apps.apple.com');
  expect(all).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
  const app = structuredData('/')['@graph'].find((node) => node['@type'] === 'MobileApplication');
  expect(app.sameAs).toContain(PLAY_STORE_URL);
  expect(app.sameAs.includes(APP_STORE_URL)).toBe(APP_STORE_LIVE);

  const files = fs
    .readdirSync(__dirname, { recursive: true })
    .filter((f) => f.endsWith('.js') && !f.endsWith('.test.js') && f !== 'stores.js');
  files.forEach((f) => {
    expect([f, /play\.google\.com|apps\.apple\.com/.test(fs.readFileSync(path.join(__dirname, f), 'utf8'))]).toEqual([f, false]);
  });
});

// Dayzi is out: nothing anywhere should still talk like a waitlist.
test('no waitlist wording left anywhere', () => {
  expect(everything()).not.toMatch(
    /early access|invite[- ]only|invite list|send invites|join the list|on the list|in testing|being tested|rolling invites|waitlist|isn’t in the app stores/i
  );
});

// The Smart App Banner: Safari on iPhone offers the app at the top of every
// page. index.html is the template for every prerendered page.
test('every page carries the Smart App Banner tag', () => {
  const tag = `<meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}"`;
  const pub = path.join(__dirname, '..', 'public');
  fs.readdirSync(pub)
    .filter((f) => f.endsWith('.html'))
    .forEach((f) => expect([f, fs.readFileSync(path.join(pub, f), 'utf8').includes(tag)]).toEqual([f, true]));
});

