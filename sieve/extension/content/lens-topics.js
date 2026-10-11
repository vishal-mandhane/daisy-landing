// Topic lens: instant keyword pass, then a batched refinement by the semantic
// engines (embeddings / LLM) through the background worker.
import { buildTopic } from '../lib/topics/query.js';
import { topicsActiveOn } from '../lib/settings.js';
import { scoreKeyword } from '../lib/topics/keyword.js';
import { decide } from '../lib/topics/decide.js';
import { createBatcher } from '../lib/queue.js';
import { hash } from '../lib/text.js';
import { applyState } from './apply.js';

export class TopicLens {
  constructor({ adapter, send, getSettings, onStats }) {
    this.adapter = adapter;
    this.send = send;
    this.getSettings = getSettings;
    this.onStats = onStats;
    this.topic = null;
    this.engines = { embedding: false, llm: false };
    this.decisions = new WeakMap(); // el -> {match, by}
    this.batcher = createBatcher((batch) => this.refine(batch), { waitMs: 200, max: 32 });
    this.refreshEngines();
  }

  async refreshEngines() {
    try {
      const st = await this.send({ type: 'engines.status' });
      this.engines = { embedding: Boolean(st?.embedding?.usable), llm: Boolean(st?.llm?.usable) };
    } catch {
      this.engines = { embedding: false, llm: false };
    }
  }

  rebuild() {
    const s = this.getSettings();
    this.topic = topicsActiveOn(s, this.adapter.id) ? buildTopic(s.topics, s.customPresets) : null;
    this.batcher.clear();
    return this.topic;
  }

  inScope(card) {
    const s = this.getSettings();
    return s.topics.scope[card.context] !== false;
  }

  wantsRefine() {
    const s = this.getSettings();
    const e = s.topics.engine;
    const emb = (e === 'auto' || e === 'embedding') && s.topics.embedding.enabled && this.engines.embedding;
    const llm = (e === 'auto' || e === 'llm') && s.topics.llm.enabled && this.engines.llm;
    return { embedding: emb, llm };
  }

  process(card) {
    if (!this.topic || !this.inScope(card)) return this.clear(card);
    const s = this.getSettings();
    const scores = {};
    const item = { title: card.raw, channel: card.channel, description: card.description };
    if (s.topics.engine !== 'embedding' && s.topics.engine !== 'llm') scores.keyword = scoreKeyword(this.topic, item).score;
    const want = this.wantsRefine();
    const needsRefine = (want.embedding || want.llm) && !(scores.keyword > 0);
    if (needsRefine) {
      // Keep the card visible until a semantic engine has judged it.
      applyState(card.el, 'topics', null, this.adapter.hideStyle);
      this.batcher.add({ card, scores, topicKey: this.topic.key });
      return;
    }
    this.finish(card, scores);
  }

  finish(card, scores) {
    const s = this.getSettings();
    const d = decide(scores, s.topics.strictness);
    this.decisions.set(card.el, d);
    applyState(card.el, 'topics', d.match ? 'show' : s.topics.action, this.adapter.hideStyle);
    card.el.dataset.sieveBy = d.by;
    this.onStats?.();
  }

  async refine(batch) {
    const topic = this.topic;
    if (!topic) return;
    const live = batch.filter((b) => b.topicKey === topic.key && b.card.el.__sieveCard === b.card);
    if (!live.length) return;
    const want = this.wantsRefine();
    const items = live.map((b) => ({
      id: hash(`${b.card.raw}|${b.card.channel}`),
      title: b.card.raw,
      channel: b.card.channel,
      description: b.card.description,
    }));
    let result = null;
    try {
      result = await this.send({ type: 'topic.refine', topic, items, engines: want });
    } catch (err) {
      console.warn('[sieve] refine failed', err);
    }
    if (this.topic !== topic) return;
    live.forEach((b, i) => {
      const extra = result?.scores?.[i] ?? {};
      this.finish(b.card, { ...b.scores, ...extra });
    });
    if (result?.engines) this.engines = { embedding: Boolean(result.engines.embedding?.usable), llm: Boolean(result.engines.llm?.usable) };
  }

  clear(card) {
    delete card.el.dataset.sieveBy;
    applyState(card.el, 'topics', null, this.adapter.hideStyle);
  }
}
