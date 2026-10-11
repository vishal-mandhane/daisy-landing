import { render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import App from './App';
import { FAQ } from './data';
import { PAGES, ROUTES, headTags, llmsTxt, sitemapXml, structuredData } from './seo';

function renderAt(path) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

beforeAll(() => {
  // jsdom has no media playback
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
});

test('home has the hero and one signup form, which every "Get early access" link reaches', () => {
  renderAt('/');
  const hero = screen.getByRole('heading', { level: 1, name: /stop missing out/i }).closest('section');
  expect(document.querySelectorAll('main form')).toHaveLength(1);
  expect(hero.querySelector('form')).toBeInTheDocument();
  expect(hero).toHaveAttribute('id', 'join');
  screen.getAllByRole('link', { name: /get early access/i }).forEach((link) => {
    expect(link).toHaveAttribute('href', '/#join');
  });
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
  ['/going-out-alone', /nobody to go with/i],
])('%s renders its page', (path, heading) => {
  renderAt(path);
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});

test('nav: How it works and Safety scroll to home sections, FAQ is its own page', () => {
  renderAt('/');
  const nav = screen.getByRole('navigation', { name: 'Main' });
  expect(within(nav).getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '/#how-it-works');
  expect(within(nav).getByRole('link', { name: 'Safety' })).toHaveAttribute('href', '/#safety');
  expect(within(nav).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
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
  // \b: "EventMeetupSocialNetworkingPlatform" in the FAQ is a joke, not a brand.
  const brands = /\b(Timeleft|Meetup|Bumble|BookMyShow|Zomato|Eventbrite|Partiful|AllEvents|HighApe|Sort My Scene|SkillBox|Urbanaut|Playo|Tinder|Hinge|FRND)\b/;
  expect('EventMeetupSocialNetworkingPlatform').not.toMatch(brands);
  expect('Meetup').toMatch(brands);
  expect(everything()).not.toMatch(brands);
});

// The apps are in testing, not in the stores: no download claims or store links
// until they are (then update the FAQ, seo.js and this test together).
test('no download claims or store links while Dayzi is invite-only', () => {
  const all = everything();
  expect(all).not.toMatch(/download|play\.google\.com|apps\.apple\.com|app store now|available now/i);
  expect(all).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
});

