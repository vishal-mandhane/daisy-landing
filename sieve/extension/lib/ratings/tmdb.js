// TMDB (https://www.themoviedb.org) — free API key, generous limits. TMDB has
// its own 0..10 community score; it is not IMDb but tracks it closely, and
// TMDB is reachable in regions where OMDb is not.
import { tokenSimilarity } from '../text.js';

export function tmdbSearchUrl(base, key, { title, year, kind }) {
  const root = base.endsWith('/') ? base : base + '/';
  const path = kind === 'series' ? 'search/tv' : kind === 'movie' ? 'search/movie' : 'search/multi';
  const u = new URL(path, root);
  u.searchParams.set('api_key', key);
  u.searchParams.set('query', title);
  u.searchParams.set('include_adult', 'false');
  if (year && kind === 'movie') u.searchParams.set('year', String(year));
  if (year && kind === 'series') u.searchParams.set('first_air_date_year', String(year));
  return u.toString();
}

function yearOf(m) {
  const d = m.release_date || m.first_air_date || '';
  const y = parseInt(d.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

/** Pick the result that best matches title and year, or null if nothing is close. */
export function pickBestMatch(results, title, year) {
  let best = null;
  let bestScore = 0;
  for (const m of results ?? []) {
    if (m.media_type && !['movie', 'tv'].includes(m.media_type)) continue;
    const name = m.title || m.name || '';
    const original = m.original_title || m.original_name || '';
    const sim = Math.max(tokenSimilarity(name, title), tokenSimilarity(original, title));
    if (sim < 0.6) continue;
    const y = yearOf(m);
    let score = sim;
    if (year && y) score += Math.abs(y - year) <= 1 ? 0.3 : -0.2;
    score += Math.min(0.1, (m.vote_count ?? 0) / 10000); // popularity tie-break
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

/** @returns {Rating} */
export function parseTmdbMatch(m) {
  const votes = m.vote_count ?? 0;
  const score = votes >= 10 && Number.isFinite(m.vote_average) ? Math.round(m.vote_average * 10) / 10 : null;
  return {
    source: 'tmdb',
    imdb: null,
    tmdb: score,
    rt: null,
    mc: null,
    tmdbId: m.id,
    title: m.title || m.name || null,
    year: yearOf(m),
    votes,
    type: m.media_type === 'tv' || m.first_air_date ? 'series' : 'movie',
    unrated: score == null,
  };
}

export async function fetchTmdbRating(q, { key, base = 'https://api.themoviedb.org/3/', fetch = globalThis.fetch }) {
  if (!key) throw new Error('TMDB API key missing');
  const attempts = [q];
  if (q.year) attempts.push({ ...q, year: null });
  for (const attempt of attempts) {
    const res = await fetch(tmdbSearchUrl(base, key, attempt));
    if (res.status === 401) throw new Error('TMDB rejected the API key');
    if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`);
    const json = await res.json();
    const m = pickBestMatch(json?.results, attempt.title, attempt.year);
    if (m) return parseTmdbMatch(m);
  }
  return null;
}
