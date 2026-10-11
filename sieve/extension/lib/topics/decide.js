// Turning engine scores into one decision. Keyword hits are near-certain, so
// they win when present; otherwise the semantic engines decide against a
// threshold derived from the user's strictness slider.

/** strictness 0..100 → cosine threshold 0.25..0.60 */
export function thresholdFor(strictness = 50) {
  const s = Math.min(100, Math.max(0, Number(strictness) || 0));
  return 0.25 + (s / 100) * 0.35;
}

/**
 * @param {{keyword?:number|null, embedding?:number|null, llm?:number|null}} scores
 * @param {number} strictness
 * @returns {{match:boolean, score:number|null, by:'keyword'|'llm'|'embedding'|'none'}}
 */
export function decide(scores, strictness = 50) {
  const t = thresholdFor(strictness);
  if (scores.llm != null) return { match: scores.llm >= 0.5, score: scores.llm, by: 'llm' };
  if (scores.keyword != null && scores.keyword > 0) return { match: true, score: scores.keyword, by: 'keyword' };
  if (scores.embedding != null) return { match: scores.embedding >= t, score: scores.embedding, by: 'embedding' };
  if (scores.keyword != null) return { match: false, score: 0, by: 'keyword' };
  return { match: true, score: null, by: 'none' }; // nothing could judge → never hide
}
