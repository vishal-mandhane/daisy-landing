import youtube from './youtube.js';
import netflix from './netflix.js';
import primevideo from './primevideo.js';
import hotstar from './hotstar.js';
import disneyplus from './disneyplus.js';
import { hulu, max, appletv } from './generic.js';

export const ADAPTERS = [youtube, netflix, primevideo, hotstar, disneyplus, hulu, max, appletv];

/**
 * Pick the adapter for a page. A `<meta name="sieve-site" content="youtube">`
 * tag overrides host matching — used by the end-to-end tests with local
 * fixture pages that mirror each site's DOM.
 */
export function pickAdapter(loc, doc) {
  const forced = doc?.querySelector?.('meta[name="sieve-site"]')?.getAttribute('content');
  if (forced) return ADAPTERS.find((a) => a.id === forced) ?? null;
  return ADAPTERS.find((a) => a.matches(loc)) ?? null;
}
