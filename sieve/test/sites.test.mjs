import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ADAPTERS, pickAdapter } from '../extension/sites/index.js';

const loc = (href) => new URL(href);

test('every adapter has the required shape', () => {
  for (const a of ADAPTERS) {
    assert.ok(a.id && a.label && typeof a.matches === 'function' && typeof a.extract === 'function' && a.cardSelector, a.id);
    assert.ok(['collapse', 'dim'].includes(a.hideStyle), a.id);
    assert.ok(typeof a.supports.ratings === 'boolean' && typeof a.supports.topics === 'boolean', a.id);
  }
});

test('host matching', () => {
  const pick = (href) => pickAdapter(loc(href), null)?.id ?? null;
  assert.equal(pick('https://www.youtube.com/'), 'youtube');
  assert.equal(pick('https://m.youtube.com/results?search_query=x'), 'youtube');
  assert.equal(pick('https://www.netflix.com/browse'), 'netflix');
  assert.equal(pick('https://www.primevideo.com/'), 'primevideo');
  assert.equal(pick('https://www.amazon.com/gp/video/storefront'), 'primevideo');
  assert.equal(pick('https://www.amazon.com/dp/B000'), null);
  assert.equal(pick('https://www.hotstar.com/in'), 'hotstar');
  assert.equal(pick('https://www.jiohotstar.com/in'), 'hotstar');
  assert.equal(pick('https://www.disneyplus.com/home'), 'disneyplus');
  assert.equal(pick('https://tv.apple.com/'), 'appletv');
  assert.equal(pick('https://example.com/'), null);
});

test('youtube contexts', () => {
  const yt = ADAPTERS.find((a) => a.id === 'youtube');
  assert.equal(yt.context(loc('https://www.youtube.com/')), 'home');
  assert.equal(yt.context(loc('https://www.youtube.com/results?search_query=x')), 'search');
  assert.equal(yt.context(loc('https://www.youtube.com/watch?v=abc')), 'watch');
  assert.equal(yt.context(loc('https://www.youtube.com/feed/subscriptions')), 'subscriptions');
  assert.equal(yt.context(loc('https://www.youtube.com/shorts/abc')), 'shorts');
  assert.equal(yt.context(loc('https://www.youtube.com/@mkbhd/videos')), 'channel');
  assert.equal(yt.context(loc('https://www.youtube.com/feed/history')), 'other');
});

test('meta override picks a forced adapter', () => {
  const doc = { querySelector: (sel) => (sel.includes('sieve-site') ? { getAttribute: () => 'netflix' } : null) };
  assert.equal(pickAdapter(loc('http://127.0.0.1:8080/x.html'), doc).id, 'netflix');
});
