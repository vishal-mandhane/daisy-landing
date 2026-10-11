/** Limit how many async jobs run at once. Returns run(fn) -> Promise. */
export function createLimiter(concurrency = 2) {
  let active = 0;
  const waiting = [];
  const next = () => {
    if (active >= concurrency || !waiting.length) return;
    active++;
    const { fn, resolve, reject } = waiting.shift();
    Promise.resolve()
      .then(fn)
      .then(resolve, reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      waiting.push({ fn, resolve, reject });
      next();
    });
}

/** Coalesce calls with the same key while one is in flight. */
export function createDedupe() {
  const inflight = new Map();
  return (key, fn) => {
    if (inflight.has(key)) return inflight.get(key);
    const p = Promise.resolve()
      .then(fn)
      .finally(() => inflight.delete(key));
    inflight.set(key, p);
    return p;
  };
}

/** Collect calls for `waitMs`, then run `flush(items)` once with up to `max` of them. */
export function createBatcher(flush, { waitMs = 150, max = 32 } = {}) {
  let items = [];
  let timer = null;
  const run = () => {
    timer = null;
    const batch = items.splice(0, max);
    if (batch.length) flush(batch);
    if (items.length) timer = setTimeout(run, 0);
  };
  return {
    add(item) {
      items.push(item);
      if (items.length >= max) {
        clearTimeout(timer);
        run();
      } else if (!timer) timer = setTimeout(run, waitMs);
    },
    clear() {
      items = [];
      clearTimeout(timer);
      timer = null;
    },
  };
}
