// Background worker: holds caches and the network-facing engines so content
// scripts stay small and the page never sees an API key.
import { api, storageArea } from '../lib/browser.js';
import { createSettingsStore } from '../lib/settings.js';
import { TtlCache } from '../lib/cache.js';
import { createRatingsService } from '../lib/ratings/index.js';
import { createLlmClassifier } from '../lib/topics/llm.js';
import { embeddingScore } from '../lib/topics/embedding.js';
import { createEmbeddingBridge } from './embedding-bridge.js';

const TOPIC_TTL = 7 * 24 * 3600 * 1000;

const store = createSettingsStore(storageArea('sync'), {
  onChange: (cb) => api.storage.onChanged.addListener((changes, area) => area === 'sync' && cb(changes)),
});
const getSettings = async () => store.get() ?? store.load();

const ratingCache = new TtlCache({ storage: storageArea('local'), namespace: 'rating', maxEntries: 6000 });
const topicCache = new TtlCache({ storage: storageArea('local'), namespace: 'topic', maxEntries: 8000 });
const ratings = createRatingsService({ getSettings, cache: ratingCache });
const bridge = createEmbeddingBridge();
const phraseVecs = new Map(); // topic.key -> {pos:[], neg:[]}
let llmStatus = { error: null, at: 0 };

async function enginesStatus() {
  const s = await getSettings();
  const emb = s.topics.embedding.enabled ? await bridge.status(s.topics.embedding.model) : { installed: null, usable: false, ready: false };
  const l = s.topics.llm;
  const label = l.provider === 'ollama' ? `Ollama · ${l.ollamaModel}` : l.provider === 'openai' ? l.openaiModel || 'OpenAI-compatible' : 'Chrome built-in';
  return {
    embedding: { ...emb, enabled: s.topics.embedding.enabled, model: s.topics.embedding.model },
    llm: { enabled: l.enabled, provider: l.provider, label, error: llmStatus.error, usable: l.enabled && !llmStatus.error },
    ratings: { provider: s.ratings.provider, hasKey: Boolean(s.ratings.keys[s.ratings.provider]), lastError: ratings.lastError() },
  };
}

async function topicVectors(topic, model) {
  let v = phraseVecs.get(`${model}|${topic.key}`);
  if (v) return v;
  const pos = await bridge.embed(topic.phrases, model);
  const neg = topic.negative.length ? await bridge.embed(topic.negative, model) : [];
  v = { pos, neg };
  if (phraseVecs.size > 20) phraseVecs.delete(phraseVecs.keys().next().value);
  phraseVecs.set(`${model}|${topic.key}`, v);
  return v;
}

/** Semantic refinement for a batch of items. Cached per (topic, item). */
async function refine({ topic, items, engines }) {
  const s = await getSettings();
  const model = s.topics.embedding.model;
  const scores = [];
  const todo = [];
  for (let i = 0; i < items.length; i++) {
    const key = `${topic.key}:${items[i].id}`;
    const cached = await topicCache.get(key);
    scores[i] = cached ?? {};
    const need = (engines.embedding && cached?.embedding == null) || (engines.llm && cached?.llm == null);
    if (need) todo.push(i);
  }
  if (todo.length && engines.embedding && s.topics.embedding.enabled) {
    try {
      const { pos, neg } = await topicVectors(topic, model);
      const texts = todo.map((i) => [items[i].title, items[i].channel].filter(Boolean).join(' — '));
      const vecs = await bridge.embed(texts, model);
      todo.forEach((i, j) => (scores[i].embedding = embeddingScore(vecs[j], pos, neg)));
    } catch (err) {
      console.warn('[sieve] embedding failed', err);
    }
  }
  if (todo.length && engines.llm && s.topics.llm.enabled) {
    try {
      const classifier = createLlmClassifier(s.topics.llm);
      const out = await classifier.classify(topic, todo.map((i) => items[i]));
      todo.forEach((i, j) => {
        if (out[j] != null) scores[i].llm = out[j];
      });
      llmStatus = { error: null, at: Date.now() };
    } catch (err) {
      llmStatus = { error: String(err.message ?? err).slice(0, 80), at: Date.now() };
      console.warn('[sieve] llm failed', err);
    }
  }
  await Promise.all(todo.map((i) => topicCache.set(`${topic.key}:${items[i].id}`, scores[i], TOPIC_TTL)));
  return { scores, engines: await enginesStatus() };
}

const handlers = {
  'rating.get': (msg) => ratings.get(msg.q),
  'engines.status': () => enginesStatus(),
  'topic.refine': (msg) => refine(msg),
  'options.open': () => api.runtime.openOptionsPage(),
  'cache.clear': async () => ({ ratings: await ratingCache.clear(), topics: await topicCache.clear() }),
  'cache.stats': async () => ({ ratings: await ratingCache.count(), topics: await topicCache.count() }),
  'embedding.warm': async (msg) => {
    bridge.resetInstalled();
    return bridge.warm(msg.model ?? (await getSettings()).topics.embedding.model);
  },
  'llm.test': async () => {
    const s = await getSettings();
    const classifier = createLlmClassifier(s.topics.llm);
    const out = await classifier.classify({ label: 'Finance', phrases: ['personal finance and investing'], negative: [] }, [
      { title: 'How I built a $100k index fund portfolio', channel: 'Money Talks' },
      { title: 'Minecraft speedrun world record', channel: 'Gamer' },
    ]);
    const ok = out[0] != null && out[1] != null;
    llmStatus = { error: ok ? null : 'unparseable reply', at: Date.now() };
    return { ok, out };
  },
  'ratings.test': async () => {
    await ratingCache.clear();
    const r = await ratings.get({ title: 'Inception', year: 2010, kind: 'movie' });
    return { rating: r, error: ratings.lastError() };
  },
  'llm.reset': () => {
    llmStatus = { error: null, at: 0 };
    return { ok: true };
  },
};

api.runtime.onMessage.addListener((msg, sender, respond) => {
  if (!msg || typeof msg !== 'object' || msg.target === 'sieve-offscreen') return;
  const fn = handlers[msg.type];
  if (!fn) return;
  Promise.resolve()
    .then(() => fn(msg, sender))
    .then((r) => respond(r ?? null), (err) => respond({ __error: String(err?.message ?? err) }));
  return true;
});

api.commands?.onCommand.addListener(async (command) => {
  if (command === 'toggle-topics') {
    const s = await getSettings();
    await store.save({ topics: { enabled: !s.topics.enabled } });
    return;
  }
  if (command === 'toggle-panel') {
    const [tab] = await api.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) api.tabs.sendMessage(tab.id, { type: 'panel.toggle' }).catch(() => {});
  }
});

api.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') api.runtime.openOptionsPage();
});

store.load();
