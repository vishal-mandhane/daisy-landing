// Keyword engine: instant, offline, no model. Matches stemmed keyword phrases
// against the stemmed title/channel/description. One confident hit is enough.
import { stems } from '../text.js';

const stemCache = new Map();
function stemPhrase(p) {
  let s = stemCache.get(p);
  if (s === undefined) {
    s = stems(p).join(' ');
    if (stemCache.size > 5000) stemCache.clear();
    stemCache.set(p, s);
  }
  return s;
}

export function itemText(item) {
  return [item.title, item.channel, item.description].filter(Boolean).join(' . ');
}

/**
 * @param {{keywords:string[], negative:string[]}} topic
 * @param {{title:string, channel?:string, description?:string}} item
 * @returns {{score:number, matched:string[], excluded:string|null}}
 */
export function scoreKeyword(topic, item) {
  const haystack = ' ' + stems(itemText(item)).join(' ') + ' ';
  const has = (kw) => {
    const s = stemPhrase(kw);
    return s.length > 0 && haystack.includes(' ' + s + ' ');
  };
  const excluded = (topic.negative ?? []).find(has) ?? null;
  if (excluded) return { score: 0, matched: [], excluded };
  const matched = (topic.keywords ?? []).filter(has);
  if (!matched.length) return { score: 0, matched, excluded: null };
  // One hit → 0.8, two → 0.9, three or more → 1. Always above any threshold.
  return { score: Math.min(1, 0.7 + 0.1 * matched.length), matched, excluded: null };
}
