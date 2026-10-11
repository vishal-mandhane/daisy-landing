// A TTL cache on top of a chrome.storage-shaped area (get/set/remove taking
// and returning plain objects). Memory layer first, storage second, pruning
// of expired and surplus entries every N writes so storage never grows
// without bound.

export class MemoryStorageArea {
  constructor() {
    this.data = new Map();
  }
  async get(keys) {
    if (keys == null) return Object.fromEntries(this.data);
    const list = Array.isArray(keys) ? keys : [keys];
    const out = {};
    for (const k of list) if (this.data.has(k)) out[k] = this.data.get(k);
    return out;
  }
  async set(obj) {
    for (const [k, v] of Object.entries(obj)) this.data.set(k, v);
  }
  async remove(keys) {
    for (const k of Array.isArray(keys) ? keys : [keys]) this.data.delete(k);
  }
}

export class TtlCache {
  /**
   * @param {{storage: {get:Function,set:Function,remove:Function}, namespace: string,
   *          maxEntries?: number, pruneEvery?: number, now?: () => number}} opts
   */
  constructor({ storage, namespace, maxEntries = 4000, pruneEvery = 100, now = Date.now }) {
    this.storage = storage;
    this.ns = `${namespace}:`;
    this.maxEntries = maxEntries;
    this.pruneEvery = pruneEvery;
    this.now = now;
    this.mem = new Map();
    this.writes = 0;
  }

  key(k) {
    return this.ns + k;
  }

  async get(k) {
    const key = this.key(k);
    const t = this.now();
    const hit = this.mem.get(key);
    if (hit) {
      if (hit.e > t) return hit.v;
      this.mem.delete(key);
    }
    const stored = await this.storage.get(key);
    const entry = stored?.[key];
    if (!entry) return undefined;
    if (entry.e <= t) {
      await this.storage.remove(key);
      return undefined;
    }
    this.mem.set(key, entry);
    return entry.v;
  }

  async set(k, v, ttlMs) {
    const key = this.key(k);
    const entry = { v, e: this.now() + ttlMs, c: this.now() };
    this.mem.set(key, entry);
    await this.storage.set({ [key]: entry });
    if (++this.writes % this.pruneEvery === 0) await this.prune();
  }

  async prune() {
    const all = await this.storage.get(null);
    const t = this.now();
    const mine = Object.entries(all).filter(([k]) => k.startsWith(this.ns));
    const expired = mine.filter(([, e]) => !e || e.e <= t).map(([k]) => k);
    const live = mine.filter(([, e]) => e && e.e > t).sort((a, b) => (a[1].c ?? 0) - (b[1].c ?? 0));
    const surplus = live.slice(0, Math.max(0, live.length - this.maxEntries)).map(([k]) => k);
    const drop = [...expired, ...surplus];
    for (const k of drop) this.mem.delete(k);
    if (drop.length) await this.storage.remove(drop);
    return drop.length;
  }

  async clear() {
    const all = await this.storage.get(null);
    const keys = Object.keys(all).filter((k) => k.startsWith(this.ns));
    this.mem.clear();
    if (keys.length) await this.storage.remove(keys);
    return keys.length;
  }

  async count() {
    const all = await this.storage.get(null);
    return Object.keys(all).filter((k) => k.startsWith(this.ns)).length;
  }
}
