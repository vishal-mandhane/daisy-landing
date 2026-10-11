import { labelledTitle, contextFromPath } from './_shared.js';

// Best-effort adapter for Hulu, Max, Apple TV+ and any catalogue that labels
// its tiles. Each has an id so users can switch it off per site.
function make(id, label, hostRe) {
  return {
    id,
    label,
    matches: (loc) => hostRe.test(loc.hostname),
    supports: { ratings: true, topics: true },
    hideStyle: 'dim',
    cardSelector: 'a[aria-label][href*="/movies/"], a[aria-label][href*="/series/"], a[aria-label][href*="/show/"], a[aria-label][href*="/movie/"], a[aria-label][href*="/watch/"], a[aria-label][href*="/details/"], [data-testid*="tile"] a[aria-label], [class*="tile"] a[aria-label], [class*="card"] a[aria-label]',
    context: (loc) => contextFromPath(loc.pathname, [[/search/, 'search'], [/^\/?$/, 'home']]),
    extract(card) {
      const title = labelledTitle(card);
      if (!title) return null;
      const href = card.getAttribute('href') ?? '';
      return { title, kind: /series|show/.test(href) ? 'series' : /movie/.test(href) ? 'movie' : null };
    },
  };
}

export const hulu = make('hulu', 'Hulu', /(^|\.)hulu\.com$/);
export const max = make('max', 'Max', /(^|\.)max\.com$/);
export const appletv = make('appletv', 'Apple TV+', /^tv\.apple\.com$/);
