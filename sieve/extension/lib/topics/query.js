// Free-text topic queries. "finance, mutual funds -crypto" → include two
// phrases, exclude one. Commas or newlines separate phrases; a leading '-'
// excludes; "not X" also excludes.
import { hash, normalize } from '../text.js';
import { presetById } from './presets.js';

export function parseQuery(q) {
  const include = [];
  const exclude = [];
  for (const chunk of String(q ?? '').split(/[,\n;]+/)) {
    // "mutual funds -crypto" → include "mutual funds", exclude "crypto"
    for (let part of chunk.split(/\s+(?=-\S)/)) {
      part = part.trim();
      if (!part) continue;
      const neg = part.match(/^(?:-|not\s+|no\s+)(.+)$/i);
      if (neg) exclude.push(neg[1].trim());
      else include.push(part);
    }
  }
  return { include, exclude };
}

/**
 * Combine active presets and the free-text query into one Topic.
 * @returns {{key:string,label:string,phrases:string[],keywords:string[],negative:string[]}|null}
 */
export function buildTopic(topics, customPresets = []) {
  const { include, exclude } = parseQuery(topics.query);
  const presets = (topics.presets ?? []).map((id) => presetById(id, customPresets)).filter(Boolean);
  if (!include.length && !presets.length) return null;

  const phrases = new Set();
  const keywords = new Set();
  const negative = new Set();
  const labels = [];
  for (const p of presets) {
    labels.push(p.label);
    for (const ph of p.phrases ?? []) phrases.add(ph);
    for (const k of p.keywords ?? []) keywords.add(normalize(k));
    for (const n of p.negative ?? []) negative.add(normalize(n));
  }
  for (const phrase of include) {
    labels.push(phrase);
    phrases.add(phrase);
    keywords.add(normalize(phrase));
  }
  for (const n of exclude) negative.add(normalize(n));
  for (const n of negative) keywords.delete(n); // an explicit exclude beats a preset keyword

  const sortedKeywords = [...keywords].filter(Boolean);
  const sortedNegative = [...negative].filter(Boolean);
  const key = hash(JSON.stringify([[...phrases], sortedKeywords, sortedNegative]));
  return {
    key,
    label: labels.join(' + '),
    phrases: [...phrases],
    keywords: sortedKeywords,
    negative: sortedNegative,
  };
}
