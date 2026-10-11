import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLimiter, createDedupe, createBatcher } from '../extension/lib/queue.js';

test('limiter caps concurrency', async () => {
  const run = createLimiter(2);
  let active = 0;
  let peak = 0;
  const job = () =>
    run(async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 5));
      active--;
    });
  await Promise.all([job(), job(), job(), job(), job()]);
  assert.equal(peak, 2);
});

test('dedupe shares in-flight promises per key', async () => {
  const dedupe = createDedupe();
  let calls = 0;
  const fn = () => new Promise((r) => setTimeout(() => r(++calls), 5));
  const [a, b] = await Promise.all([dedupe('x', fn), dedupe('x', fn)]);
  assert.equal(a, b);
  assert.equal(calls, 1);
  await dedupe('x', fn);
  assert.equal(calls, 2);
});

test('batcher flushes after wait or when full', async () => {
  const flushed = [];
  const b = createBatcher((items) => flushed.push(items), { waitMs: 10, max: 3 });
  b.add(1);
  b.add(2);
  b.add(3); // full → immediate
  assert.deepEqual(flushed, [[1, 2, 3]]);
  b.add(4);
  await new Promise((r) => setTimeout(r, 25));
  assert.deepEqual(flushed, [[1, 2, 3], [4]]);
});
