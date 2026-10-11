// Settings schema, defaults and deep-merge. Settings live in storage.sync so
// they follow the user across devices; caches live in storage.local.

export const SETTINGS_KEY = 'sieve.settings';

export const DEFAULTS = Object.freeze({
  version: 1,
  sites: {
    youtube: true,
    netflix: true,
    primevideo: true,
    hotstar: true,
    disneyplus: true,
    hulu: true,
    max: true,
    appletv: true,
  },
  ratings: {
    enabled: true,
    provider: 'omdb', // 'omdb' | 'tmdb'
    keys: { omdb: '', tmdb: '' },
    endpoints: { omdb: 'https://www.omdbapi.com/', tmdb: 'https://api.themoviedb.org/3/' },
    showBadges: true,
    minImdb: 0, // 0 = no threshold. IMDb 0..10 (TMDB score is used on the same scale)
    minRt: 0, // 0 = no threshold. Rotten Tomatoes 0..100
    action: 'dim', // 'dim' | 'hide'
    hideUnrated: false,
  },
  topics: {
    enabled: true, // master switch (Alt+Shift+T pauses everything)
    sites: {}, // per-site switch; see topicsActiveOn(): YouTube on, OTT sites opt-in
    query: '', // "finance, mutual funds -crypto"
    presets: [], // preset ids that are switched on
    action: 'hide', // 'dim' | 'hide'
    strictness: 50, // 0 loose .. 100 strict
    engine: 'auto', // 'auto' | 'keyword' | 'embedding' | 'llm'
    embedding: {
      enabled: true,
      model: 'Xenova/all-MiniLM-L6-v2',
    },
    llm: {
      enabled: false,
      provider: 'ollama', // 'ollama' | 'openai' | 'chrome'
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'llama3.2',
      openaiUrl: 'https://api.groq.com/openai/v1',
      openaiKey: '',
      openaiModel: 'llama-3.1-8b-instant',
    },
    scope: {
      home: true,
      search: true,
      watch: true,
      subscriptions: true,
      shorts: true,
      channel: false,
      other: true,
    },
  },
  ui: {
    toolbar: true,
    position: 'bottom-right', // 'bottom-right' | 'bottom-left'
  },
  customPresets: [], // [{id,label,phrases:[],keywords:[]}]
});

/** Is the Topic lens active on this site? YouTube is on by default, OTT catalogues opt in. */
export function topicsActiveOn(settings, siteId) {
  if (!settings.topics.enabled) return false;
  const v = settings.topics.sites?.[siteId];
  return v == null ? siteId === 'youtube' : Boolean(v);
}

export function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** Deep merge `patch` over `base`; arrays and scalars replace, objects recurse. */
export function deepMerge(base, patch) {
  if (!isPlainObject(base) || !isPlainObject(patch)) return patch === undefined ? base : patch;
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    out[k] = isPlainObject(base[k]) && isPlainObject(v) ? deepMerge(base[k], v) : v;
  }
  return out;
}

/** Fill a stored (possibly partial or older) settings object with defaults. */
export function mergeSettings(stored) {
  return deepMerge(DEFAULTS, isPlainObject(stored) ? stored : {});
}

/** Minimal validation so a bad import cannot wedge the extension. */
export function sanitizeSettings(s) {
  const m = mergeSettings(s);
  m.ratings.minImdb = clampNum(m.ratings.minImdb, 0, 10);
  m.ratings.minRt = clampNum(m.ratings.minRt, 0, 100);
  m.ratings.action = m.ratings.action === 'hide' ? 'hide' : 'dim';
  m.ratings.provider = ['omdb', 'tmdb'].includes(m.ratings.provider) ? m.ratings.provider : 'omdb';
  m.topics.strictness = clampNum(m.topics.strictness, 0, 100);
  m.topics.action = m.topics.action === 'dim' ? 'dim' : 'hide';
  m.topics.engine = ['auto', 'keyword', 'embedding', 'llm'].includes(m.topics.engine) ? m.topics.engine : 'auto';
  m.topics.presets = Array.isArray(m.topics.presets) ? m.topics.presets.filter((x) => typeof x === 'string') : [];
  m.topics.query = typeof m.topics.query === 'string' ? m.topics.query.slice(0, 500) : '';
  m.customPresets = Array.isArray(m.customPresets) ? m.customPresets.filter(validPreset) : [];
  return m;
}

function validPreset(p) {
  return isPlainObject(p) && typeof p.id === 'string' && typeof p.label === 'string';
}

function clampNum(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.min(hi, Math.max(lo, x));
}

/** Storage-backed store. `area` is a chrome.storage-shaped object. */
export function createSettingsStore(area, { onChange } = {}) {
  let cached = null;
  const listeners = new Set();
  async function load() {
    const got = await area.get(SETTINGS_KEY);
    cached = sanitizeSettings(got?.[SETTINGS_KEY]);
    return cached;
  }
  async function save(patch) {
    const current = cached ?? (await load());
    cached = sanitizeSettings(deepMerge(current, patch));
    await area.set({ [SETTINGS_KEY]: cached });
    return cached;
  }
  async function replace(full) {
    cached = sanitizeSettings(full);
    await area.set({ [SETTINGS_KEY]: cached });
    return cached;
  }
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  // Wire storage change events when the caller gives us one.
  if (onChange) {
    onChange((changes) => {
      if (!changes[SETTINGS_KEY]) return;
      cached = sanitizeSettings(changes[SETTINGS_KEY].newValue);
      for (const fn of listeners) fn(cached);
    });
  }
  return { load, save, replace, subscribe, get: () => cached };
}
