// OMDb (https://www.omdbapi.com) — IMDb, Rotten Tomatoes and Metacritic in one
// call. Free tier: 1,000 requests/day with your own key. We cache for weeks,
// so that is plenty for daily browsing.

export function omdbUrl(base, key, { title, year, kind }) {
  const u = new URL(base.endsWith('/') ? base : base + '/');
  u.searchParams.set('apikey', key);
  u.searchParams.set('t', title);
  if (year) u.searchParams.set('y', String(year));
  if (kind === 'series' || kind === 'movie') u.searchParams.set('type', kind);
  return u.toString();
}

function num(v) {
  const n = parseFloat(String(v ?? '').trim().replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** @returns {Rating|null} */
export function parseOmdb(json) {
  if (!json || json.Response === 'False') return null;
  const ratings = Array.isArray(json.Ratings) ? json.Ratings : [];
  const rtEntry = ratings.find((r) => /rotten/i.test(r.Source));
  const mcEntry = ratings.find((r) => /metacritic/i.test(r.Source));
  const imdb = num(json.imdbRating);
  const rt = rtEntry ? num(rtEntry.Value) : null;
  const mc = mcEntry ? num(mcEntry.Value) : num(json.Metascore);
  if (imdb == null && rt == null && mc == null) {
    return { source: 'omdb', imdb: null, rt: null, mc: null, imdbId: json.imdbID ?? null, title: json.Title ?? null, year: num(json.Year), votes: null, type: json.Type ?? null, unrated: true };
  }
  return {
    source: 'omdb',
    imdb,
    rt: rt == null ? null : Math.round(rt),
    mc: mc == null ? null : Math.round(mc),
    imdbId: json.imdbID ?? null,
    title: json.Title ?? null,
    year: num(json.Year),
    votes: num(json.imdbVotes),
    type: json.Type ?? null,
  };
}

export class ProviderError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'ProviderError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Look a title up. Tries title+year first, then title alone, then without a
 * type filter, because the year an OTT site shows is often the local release
 * year rather than the original one.
 */
export async function fetchOmdbRating(q, { key, base = 'https://www.omdbapi.com/', fetch = globalThis.fetch }) {
  if (!key) throw new ProviderError('OMDb API key missing', { code: 'no-key' });
  const attempts = [q];
  if (q.year) attempts.push({ ...q, year: null });
  if (q.kind) attempts.push({ ...q, year: null, kind: null });
  for (const attempt of attempts) {
    const res = await fetch(omdbUrl(base, key, attempt));
    if (res.status === 401) throw new ProviderError('OMDb rejected the API key', { status: 401, code: 'bad-key' });
    if (!res.ok) throw new ProviderError(`OMDb HTTP ${res.status}`, { status: res.status });
    const json = await res.json();
    if (json?.Error && /limit/i.test(json.Error)) throw new ProviderError('OMDb daily limit reached', { code: 'rate-limit' });
    if (json?.Error && /invalid api key/i.test(json.Error)) throw new ProviderError('OMDb rejected the API key', { code: 'bad-key' });
    const r = parseOmdb(json);
    if (r) return r;
  }
  return null;
}
