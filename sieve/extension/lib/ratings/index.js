// The ratings service: cache → provider, with in-flight dedupe and a
// concurrency limit so a page with 200 cards never hammers the provider.
import { titleKey } from '../titles.js';
import { createLimiter, createDedupe } from '../queue.js';
import { fetchOmdbRating } from './omdb.js';
import { fetchTmdbRating } from './tmdb.js';

const HIT_TTL = 21 * 24 * 3600 * 1000; // ratings drift slowly
const MISS_TTL = 3 * 24 * 3600 * 1000; // unknown titles get re-tried later
const ERROR_TTL = 10 * 60 * 1000; // provider errors: back off briefly

export const NOT_FOUND = { source: null, imdb: null, rt: null, mc: null, unrated: true, missing: true };

export function createRatingsService({ getSettings, cache, fetch = globalThis.fetch, concurrency = 3 }) {
  const limit = createLimiter(concurrency);
  const dedupe = createDedupe();
  let lastError = null;

  async function lookup(q, settings) {
    const r = settings.ratings;
    const opts = { key: r.keys[r.provider], base: r.endpoints[r.provider], fetch };
    if (r.provider === 'tmdb') return fetchTmdbRating(q, opts);
    return fetchOmdbRating(q, opts);
  }

  return {
    /** @param {{title:string, year?:number|null, kind?:string|null}} q */
    async get(q) {
      const settings = await getSettings();
      const key = `${settings.ratings.provider}:${titleKey(q.title, q.year)}`;
      const cached = await cache.get(key);
      if (cached !== undefined) return cached;
      return dedupe(key, () =>
        limit(async () => {
          const again = await cache.get(key);
          if (again !== undefined) return again;
          try {
            const r = (await lookup(q, settings)) ?? NOT_FOUND;
            lastError = null;
            await cache.set(key, r, r.missing ? MISS_TTL : HIT_TTL);
            return r;
          } catch (err) {
            lastError = { message: err.message, code: err.code ?? null, at: Date.now() };
            // Cache the failure for a bit so we do not retry the same title in a loop.
            const r = { ...NOT_FOUND, error: err.code ?? 'error' };
            await cache.set(key, r, ERROR_TTL);
            return r;
          }
        }),
      );
    },
    lastError: () => lastError,
    clear: () => cache.clear(),
  };
}

/**
 * Decide whether a card passes the user's thresholds.
 * @returns {'pass'|'fail'|'unrated'|'pending'}
 */
export function judgeRating(rating, { minImdb = 0, minRt = 0, hideUnrated = false }) {
  if (rating === undefined) return 'pending';
  if (!rating || rating.unrated) return hideUnrated ? 'fail' : 'unrated';
  const score10 = rating.imdb ?? rating.tmdb ?? null;
  if (minImdb > 0) {
    if (score10 == null) return hideUnrated ? 'fail' : 'unrated';
    if (score10 < minImdb) return 'fail';
  }
  if (minRt > 0) {
    if (rating.rt == null) {
      // A title with a good IMDb score but no RT entry should not vanish.
      if (minImdb > 0 && score10 != null) return 'pass';
      return hideUnrated ? 'fail' : 'unrated';
    }
    if (rating.rt < minRt) return 'fail';
  }
  return 'pass';
}

export function formatRating(rating) {
  if (!rating || rating.unrated) return rating?.error ? '…' : 'n/a';
  const parts = [];
  if (rating.imdb != null) parts.push(`IMDb ${rating.imdb.toFixed(1)}`);
  if (rating.tmdb != null) parts.push(`TMDB ${rating.tmdb.toFixed(1)}`);
  if (rating.rt != null) parts.push(`RT ${rating.rt}%`);
  if (rating.mc != null && rating.rt == null) parts.push(`MC ${rating.mc}`);
  return parts.join(' · ') || 'n/a';
}
