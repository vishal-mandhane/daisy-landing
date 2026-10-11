import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TtlCache, MemoryStorageArea } from '../extension/lib/cache.js';

test('TtlCache stores, expires and prunes', async () => {
  let now = 1000;
  const storage = new MemoryStorageArea();
  const cache = new TtlCache({ storage, namespace: 'r', maxEntries: 3, pruneEvery: 2, now: () => now });
  await cache.set('a', { imdb: 8 }, 100);
  assert.deepEqual(await cache.get('a'), { imdb: 8 });
  now = 1101;
  assert.equal(await cache.get('a'), undefined);
  // storage-only hit (new instance = cold memory)
  await cache.set('b', 1, 1000);
  const cold = new TtlCache({ storage, namespace: 'r', now: () => now });
  assert.equal(await cold.get('b'), 1);
  // prune to maxEntries, oldest first
  await cache.set('c', 2, 1000);
  await cache.set('d', 3, 1000);
  await cache.set('e', 4, 1000);
  await cache.set('f', 5, 1000); // triggers prune (every 2 writes)
  assert.ok((await cache.count()) <= 3);
  assert.equal(await cache.get('f'), 5);
  assert.equal(await cache.get('b'), undefined);
  const before = await cache.count();
  assert.equal(await cache.clear(), before);
  assert.equal(await cache.count(), 0);
});

test('namespaces do not collide', async () => {
  const storage = new MemoryStorageArea();
  const a = new TtlCache({ storage, namespace: 'a' });
  const b = new TtlCache({ storage, namespace: 'b' });
  await a.set('k', 'A', 1e6);
  await b.set('k', 'B', 1e6);
  assert.equal(await a.get('k'), 'A');
  assert.equal(await b.get('k'), 'B');
  assert.equal(await a.clear(), 1);
  assert.equal(await b.get('k'), 'B');
});
