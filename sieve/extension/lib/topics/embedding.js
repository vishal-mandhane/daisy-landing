// Embedding engine helpers (pure). The model itself runs in the offscreen
// document (see offscreen/host.js); here we only do vector math and
// threshold decisions so they can be unit tested.

export function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}

/** Similarity of one item vector to a topic = max over the topic's phrase vectors. */
export function topicSimilarity(itemVec, phraseVecs) {
  let best = -1;
  for (const p of phraseVecs) best = Math.max(best, cosine(itemVec, p));
  return best;
}

/** Items matching a negative phrase more than any positive phrase are vetoed. */
export function embeddingScore(itemVec, positiveVecs, negativeVecs = []) {
  const pos = topicSimilarity(itemVec, positiveVecs);
  if (negativeVecs.length) {
    const neg = topicSimilarity(itemVec, negativeVecs);
    if (neg > pos && neg > 0.35) return 0;
  }
  return pos;
}
