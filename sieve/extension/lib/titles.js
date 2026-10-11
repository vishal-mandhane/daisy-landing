// Turning the messy strings OTT sites expose (aria-labels, alt text, link
// text) into something a ratings provider can look up.
import { normalize } from './text.js';

const SITE_SUFFIX = /\s*[|\-–—:]\s*(prime video|amazon\.?com|netflix|disney\+|disney plus|hotstar|jiohotstar|hulu|max|apple tv\+?|youtube)\s*$/i;

/**
 * @param {string} raw
 * @returns {{title: string, year: number|null, kind: 'movie'|'series'|null}}
 */
export function parseTitle(raw) {
  let s = String(raw ?? '').replace(/\s+/g, ' ').trim();
  s = s.replace(/^(watch|play|stream)\s+/i, '');
  s = s.replace(SITE_SUFFIX, '');

  let year = null;
  const ym = s.match(/[([]\s*((?:19|20)\d{2})\s*[)\]]\s*$/);
  if (ym) {
    year = Number(ym[1]);
    s = s.slice(0, ym.index).trim();
  }

  let kind = null;
  // "Title: Season 2", "Title - Part 1 - Official Trailer", "Title (Season 3)". Needs punctuation
  // before the marker and nothing but a trailer note after it, so a YouTube title such as
  // "Fortnite chapter 7 gameplay" is left alone.
  const season = s.match(/^(.*?)\s*(?:[:,\-–—|]\s*|\(\s*)(?:season|series|part|volume|vol\.?|chapter|episode|ep\.?|s)\s*\d+\)?(?:\s*[-:–—|]?\s*(?:official\s+)?(?:trailer|teaser))?\s*$/i);
  if (season && season[1].trim()) {
    kind = 'series';
    s = season[1].trim();
  }
  if (/:\s*(limited series|the series|the complete series)$/i.test(s)) {
    kind = 'series';
    s = s.replace(/:\s*(limited series|the series|the complete series)$/i, '');
  }
  s = s.replace(/\s*[([]?\s*(official\s+)?(trailer|teaser)\s*[)\]]?$/i, '').trim();
  s = s.replace(/^"(.*)"$/, '$1').replace(/[\s:,\-–—]+$/, '').trim();

  return { title: s, year, kind };
}

/** Stable key for caches: normalized title plus year when known. */
export function titleKey(title, year) {
  const t = normalize(title);
  return year ? `${t}|${year}` : t;
}
