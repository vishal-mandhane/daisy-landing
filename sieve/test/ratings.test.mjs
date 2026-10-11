import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseOmdb, omdbUrl, fetchOmdbRating } from '../extension/lib/ratings/omdb.js';
import { pickBestMatch, parseTmdbMatch, tmdbSearchUrl } from '../extension/lib/ratings/tmdb.js';
import { createRatingsService, judgeRating, formatRating, NOT_FOUND } from '../extension/lib/ratings/index.js';
import { TtlCache, MemoryStorageArea } from '../extension/lib/cache.js';

const OMDB_OK = {
  Title: 'Inception', Year: '2010', Type: 'movie', imdbID: 'tt1375666', imdbRating: '8.8', imdbVotes: '2,500,000', Metascore: '74',
  Ratings: [{ Source: 'Internet Movie Database', Value: '8.8/10' }, { Source: 'Rotten Tomatoes', Value: '87%' }, { Source: 'Metacritic', Value: '74/100' }],
  Response: 'True',
};

test('parseOmdb extracts the three scores', () => {
  const r = parseOmdb(OMDB_OK);
  assert.equal(r.imdb, 8.8);
  assert.equal(r.rt, 87);
  assert.equal(r.mc, 74);
  assert.equal(r.year, 2010);
  assert.equal(r.votes, 2500000);
  assert.equal(parseOmdb({ Response: 'False', Error: 'Movie not found!' }), null);
  assert.equal(parseOmdb({ Response: 'True', Title: 'X', imdbRating: 'N/A', Ratings: [] }).unrated, true);
});

test('omdbUrl includes key, title, year and type', () => {
  const u = new URL(omdbUrl('https://www.omdbapi.com/', 'k1', { title: 'Dune: Part Two', year: 2024, kind: 'movie' }));
  assert.equal(u.searchParams.get('apikey'), 'k1');
  assert.equal(u.searchParams.get('t'), 'Dune: Part Two');
  assert.equal(u.searchParams.get('y'), '2024');
  assert.equal(u.searchParams.get('type'), 'movie');
});

test('fetchOmdbRating retries without year, then without type', async () => {
  const urls = [];
  const fetch = async (u) => {
    urls.push(u);
    const p = new URL(u).searchParams;
    if (p.get('y') || p.get('type')) return { ok: true, status: 200, json: async () => ({ Response: 'False', Error: 'Movie not found!' }) };
    return { ok: true, status: 200, json: async () => OMDB_OK };
  };
  const r = await fetchOmdbRating({ title: 'Inception', year: 2011, kind: 'series' }, { key: 'k', fetch });
  assert.equal(urls.length, 3);
  assert.equal(r.imdb, 8.8);
});

test('fetchOmdbRating surfaces key and limit errors', async () => {
  const bad = async () => ({ ok: false, status: 401, json: async () => ({}) });
  await assert.rejects(fetchOmdbRating({ title: 'x' }, { key: 'k', fetch: bad }), /rejected/);
  const limited = async () => ({ ok: true, status: 200, json: async () => ({ Response: 'False', Error: 'Request limit reached!' }) });
  await assert.rejects(fetchOmdbRating({ title: 'x' }, { key: 'k', fetch: limited }), /limit/);
});

test('tmdb picks the closest title/year and ignores people', () => {
  const results = [
    { media_type: 'person', name: 'Inception Guy' },
    { media_type: 'movie', title: 'Inception', release_date: '2010-07-16', vote_average: 8.4, vote_count: 35000, id: 27205 },
    { media_type: 'movie', title: 'Inception: The Cobol Job', release_date: '2010-12-07', vote_average: 7.0, vote_count: 400, id: 1 },
    { media_type: 'tv', name: 'Inception', first_air_date: '2021-01-01', vote_average: 5, vote_count: 12, id: 2 },
  ];
  const best = pickBestMatch(results, 'Inception', 2010);
  assert.equal(best.id, 27205);
  assert.equal(pickBestMatch(results, 'Totally Different', 2010), null);
  const r = parseTmdbMatch(best);
  assert.equal(r.tmdb, 8.4);
  assert.equal(r.type, 'movie');
  assert.equal(r.year, 2010);
  assert.equal(parseTmdbMatch({ title: 'Obscure', vote_average: 9, vote_count: 3 }).unrated, true);
});

test('tmdbSearchUrl chooses endpoint by kind', () => {
  assert.match(tmdbSearchUrl('https://api.themoviedb.org/3/', 'k', { title: 'x', kind: 'series', year: 2020 }), /search\/tv\?.*first_air_date_year=2020/);
  assert.match(tmdbSearchUrl('https://api.themoviedb.org/3', 'k', { title: 'x' }), /\/3\/search\/multi\?/);
});

test('ratings service caches, dedupes and backs off on errors', async () => {
  let calls = 0;
  const fetch = async () => {
    calls++;
    return { ok: true, status: 200, json: async () => OMDB_OK };
  };
  const settings = { ratings: { provider: 'omdb', keys: { omdb: 'k' }, endpoints: { omdb: 'https://x/' } } };
  const cache = new TtlCache({ storage: new MemoryStorageArea(), namespace: 'r' });
  const svc = createRatingsService({ getSettings: async () => settings, cache, fetch });
  const [a, b] = await Promise.all([svc.get({ title: 'Inception', year: 2010 }), svc.get({ title: 'inception', year: 2010 })]);
  assert.equal(a.imdb, 8.8);
  assert.equal(b.imdb, 8.8);
  assert.equal(calls, 1);
  await svc.get({ title: 'Inception', year: 2010 });
  assert.equal(calls, 1);

  const failing = createRatingsService({ getSettings: async () => settings, cache: new TtlCache({ storage: new MemoryStorageArea(), namespace: 'r' }), fetch: async () => ({ ok: false, status: 500, json: async () => ({}) }) });
  const r = await failing.get({ title: 'Boom' });
  assert.equal(r.unrated, true);
  assert.ok(failing.lastError().message.includes('500'));
});

test('judgeRating applies thresholds sensibly', () => {
  const good = { imdb: 8.1, rt: 92 };
  const meh = { imdb: 6.2, rt: 40 };
  const noRt = { imdb: 7.9, rt: null };
  assert.equal(judgeRating(undefined, {}), 'pending');
  assert.equal(judgeRating(good, { minImdb: 7 }), 'pass');
  assert.equal(judgeRating(meh, { minImdb: 7 }), 'fail');
  assert.equal(judgeRating(meh, { minRt: 60 }), 'fail');
  assert.equal(judgeRating(noRt, { minImdb: 7, minRt: 60 }), 'pass');
  assert.equal(judgeRating(noRt, { minRt: 60 }), 'unrated');
  assert.equal(judgeRating(noRt, { minRt: 60, hideUnrated: true }), 'fail');
  assert.equal(judgeRating(NOT_FOUND, { minImdb: 7 }), 'unrated');
  assert.equal(judgeRating(NOT_FOUND, { minImdb: 7, hideUnrated: true }), 'fail');
  assert.equal(judgeRating({ tmdb: 7.5 }, { minImdb: 7 }), 'pass');
  assert.equal(judgeRating(good, {}), 'pass');
});

test('formatRating', () => {
  assert.equal(formatRating({ imdb: 8.8, rt: 87, mc: 74 }), 'IMDb 8.8 · RT 87%');
  assert.equal(formatRating({ imdb: 7, rt: null, mc: 60 }), 'IMDb 7.0 · MC 60');
  assert.equal(formatRating({ tmdb: 7.25 }), 'TMDB 7.3');
  assert.equal(formatRating(NOT_FOUND), 'n/a');
});
