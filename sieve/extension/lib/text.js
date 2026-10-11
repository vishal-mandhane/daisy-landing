// Pure text utilities shared by every engine. No DOM, no browser APIs.

/** Lowercase, strip accents and punctuation, collapse whitespace. */
export function normalize(input) {
  return String(input ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function tokenize(input) {
  const n = normalize(input);
  return n ? n.split(' ') : [];
}

/**
 * Very conservative English stemmer. It only needs to map inflections of the
 * same word onto the same stem (invest/investing/invested/investor) and must
 * never merge unrelated words, so it strips little.
 */
export function stem(word) {
  let w = word;
  if (w.length > 6 && w.endsWith('ization')) return w.slice(0, -7) + 'iz';
  if (w.length > 5 && w.endsWith('ities')) return w.slice(0, -5) + 'ity';
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  let stripped = false;
  if (w.length > 5 && w.endsWith('ing')) (w = w.slice(0, -3)), (stripped = true);
  else if (w.length > 5 && w.endsWith('ers')) (w = w.slice(0, -3)), (stripped = true);
  else if (w.length > 4 && (w.endsWith('ed') || w.endsWith('er'))) (w = w.slice(0, -2)), (stripped = true);
  else if (w.length > 4 && w.endsWith('es') && !w.endsWith('ses')) (w = w.slice(0, -2)), (stripped = true);
  else if (w.length > 4 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
  if (stripped && w.length > 3 && /([^aeiou])\1$/.test(w)) w = w.slice(0, -1); // running -> runn -> run
  return w;
}

export function stems(input) {
  return tokenize(input).map(stem);
}

/** 32-bit FNV-1a hash as 8 hex chars. Stable across browsers and Node. */
export function hash(input) {
  let h = 0x811c9dc5;
  const s = String(input);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Sørensen–Dice similarity on token sets, 0..1. */
export function tokenSimilarity(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (!ta.size || !tb.size) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common++;
  return (2 * common) / (ta.size + tb.size);
}

export function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}
