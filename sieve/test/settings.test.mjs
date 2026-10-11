import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, mergeSettings, sanitizeSettings, createSettingsStore, SETTINGS_KEY, topicsActiveOn } from '../extension/lib/settings.js';
import { MemoryStorageArea } from '../extension/lib/cache.js';

test('mergeSettings fills gaps and keeps overrides', () => {
  const s = mergeSettings({ ratings: { minImdb: 7 }, topics: { presets: ['ai'] } });
  assert.equal(s.ratings.minImdb, 7);
  assert.equal(s.ratings.provider, DEFAULTS.ratings.provider);
  assert.deepEqual(s.topics.presets, ['ai']);
  assert.equal(s.topics.llm.ollamaUrl, DEFAULTS.topics.llm.ollamaUrl);
});

test('sanitizeSettings clamps and coerces bad input', () => {
  const s = sanitizeSettings({ ratings: { minImdb: 42, action: 'explode', provider: 'x' }, topics: { strictness: -5, presets: [1, 'ai'], engine: 'magic' }, customPresets: [null, { id: 'c', label: 'C' }] });
  assert.equal(s.ratings.minImdb, 10);
  assert.equal(s.ratings.action, 'dim');
  assert.equal(s.ratings.provider, 'omdb');
  assert.equal(s.topics.strictness, 0);
  assert.deepEqual(s.topics.presets, ['ai']);
  assert.equal(s.topics.engine, 'auto');
  assert.equal(s.customPresets.length, 1);
});

test('topicsActiveOn: YouTube on by default, OTT opt-in, master pause wins', () => {
  const s = mergeSettings({});
  assert.equal(topicsActiveOn(s, 'youtube'), true);
  assert.equal(topicsActiveOn(s, 'netflix'), false);
  assert.equal(topicsActiveOn(mergeSettings({ topics: { sites: { netflix: true } } }), 'netflix'), true);
  assert.equal(topicsActiveOn(mergeSettings({ topics: { sites: { youtube: false } } }), 'youtube'), false);
  assert.equal(topicsActiveOn(mergeSettings({ topics: { enabled: false } }), 'youtube'), false);
});

test('settings store saves patches and notifies subscribers', async () => {
  const area = new MemoryStorageArea();
  let listener = null;
  const store = createSettingsStore(area, { onChange: (cb) => (listener = cb) });
  await store.load();
  await store.save({ topics: { query: 'finance' } });
  assert.equal(store.get().topics.query, 'finance');
  assert.equal((await area.get(SETTINGS_KEY))[SETTINGS_KEY].topics.query, 'finance');
  const seen = [];
  store.subscribe((s) => seen.push(s.topics.query));
  listener({ [SETTINGS_KEY]: { newValue: { topics: { query: 'ai' } } } });
  assert.deepEqual(seen, ['ai']);
  assert.equal(store.get().ratings.provider, 'omdb');
});
