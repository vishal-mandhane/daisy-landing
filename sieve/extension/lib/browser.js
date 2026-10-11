// One handle for the WebExtension API in Chrome, Edge, Brave, Opera and Firefox.
// Chrome MV3 already returns promises from the methods we use; Firefox exposes
// the promise-based `browser` namespace natively.
export const api = globalThis.browser ?? globalThis.chrome;

/** chrome.storage area helper that always returns a promise. */
export function storageArea(name) {
  const area = api.storage[name];
  return {
    get: (keys) => area.get(keys),
    set: (obj) => area.set(obj),
    remove: (keys) => area.remove(keys),
  };
}

export function runtimeUrl(path) {
  return api.runtime.getURL(path);
}
