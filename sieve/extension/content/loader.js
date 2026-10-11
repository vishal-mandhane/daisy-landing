// Content scripts are classic scripts; this one-liner boots the real app as
// an ES module so the rest of the codebase can share code with the
// background worker, the popup and the tests.
(() => {
  if (globalThis.__sieveLoaded) return;
  globalThis.__sieveLoaded = true;
  const api = globalThis.browser ?? globalThis.chrome;
  import(api.runtime.getURL('content/app.js')).catch((err) => console.warn('[sieve] failed to start', err));
})();
