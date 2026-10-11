import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, presetById } from '../extension/lib/topics/presets.js';
import { parseQuery, buildTopic } from '../extension/lib/topics/query.js';
import { scoreKeyword } from '../extension/lib/topics/keyword.js';
import { decide, thresholdFor } from '../extension/lib/topics/decide.js';
import { buildClassifyPrompt, parseClassifyReply, createLlmClassifier, LLM_BATCH } from '../extension/lib/topics/llm.js';
import { cosine, topicSimilarity, embeddingScore } from '../extension/lib/topics/embedding.js';

test('presets are well formed and unique', () => {
  const ids = new Set();
  for (const p of PRESETS) {
    assert.ok(!ids.has(p.id), `duplicate ${p.id}`);
    ids.add(p.id);
    assert.ok(p.label && p.phrases.length && p.keywords.length, p.id);
    for (const k of p.keywords) assert.equal(k, k.toLowerCase().trim(), `${p.id}: ${k}`);
  }
  assert.equal(presetById('finance').label, 'Finance');
  assert.equal(presetById('nope'), null);
  assert.equal(presetById('c1', [{ id: 'c1', label: 'Custom' }]).label, 'Custom');
});

test('parseQuery splits includes and excludes', () => {
  assert.deepEqual(parseQuery('finance, mutual funds -crypto, not memes'), { include: ['finance', 'mutual funds'], exclude: ['crypto', 'memes'] });
  assert.deepEqual(parseQuery(''), { include: [], exclude: [] });
  assert.deepEqual(parseQuery('  ai \n robotics ;  -hype '), { include: ['ai', 'robotics'], exclude: ['hype'] });
});

test('buildTopic merges presets and free text; explicit excludes win', () => {
  assert.equal(buildTopic({ query: '', presets: [] }), null);
  const t = buildTopic({ query: 'mutual funds -crypto', presets: ['finance'] });
  assert.equal(t.label, 'Finance + mutual funds');
  assert.ok(t.keywords.includes('mutual funds'));
  assert.ok(t.keywords.includes('stock market'));
  assert.ok(!t.keywords.includes('crypto'), 'crypto removed by exclude');
  assert.ok(t.negative.includes('crypto'));
  assert.ok(t.phrases.includes('mutual funds'));
  assert.equal(t.key, buildTopic({ query: 'mutual funds -crypto', presets: ['finance'] }).key);
  assert.notEqual(t.key, buildTopic({ query: 'mutual funds', presets: ['finance'] }).key);
});

test('scoreKeyword matches stemmed phrases and honours excludes', () => {
  const t = buildTopic({ query: 'mutual funds -crypto', presets: ['finance'] });
  assert.ok(scoreKeyword(t, { title: 'Best Mutual Fund for SIP in 2026' }).score > 0.7);
  assert.ok(scoreKeyword(t, { title: 'How I invested my first salary', channel: 'Money Matters' }).score > 0);
  assert.equal(scoreKeyword(t, { title: 'Minecraft speedrun world record' }).score, 0);
  const vetoed = scoreKeyword(t, { title: 'Why Bitcoin and crypto will 10x your money' });
  assert.equal(vetoed.score, 0);
  assert.equal(vetoed.excluded, 'crypto');
  // "AI" must not match inside other words
  const ai = buildTopic({ query: '', presets: ['ai'] });
  assert.equal(scoreKeyword(ai, { title: 'Thailand travel vlog: Chiang Mai' }).score, 0);
  assert.ok(scoreKeyword(ai, { title: 'Chiang Mai AI meetup' }).score > 0);
});

test('decide: keyword wins, llm overrides, embedding vs threshold', () => {
  assert.equal(thresholdFor(0), 0.25);
  assert.equal(thresholdFor(100), 0.6);
  assert.equal(decide({ keyword: 0.8, embedding: 0.1 }, 100).match, true);
  assert.equal(decide({ keyword: 0, embedding: 0.5 }, 50).match, true);
  assert.equal(decide({ keyword: 0, embedding: 0.3 }, 50).match, false);
  assert.equal(decide({ keyword: 0.8, llm: 0 }, 50).match, false);
  assert.equal(decide({ keyword: 0 }, 50).match, false);
  assert.deepEqual(decide({}, 50), { match: true, score: null, by: 'none' });
});

test('llm prompt and reply parsing', () => {
  const topic = { label: 'Finance', phrases: ['personal finance'], negative: ['crypto'] };
  const items = [{ title: 'A', channel: 'c' }, { title: 'B' }];
  const p = buildClassifyPrompt(topic, items);
  assert.match(p, /Topic: "Finance"/);
  assert.match(p, /exactly 2 numbers/);
  assert.match(p, /Exclude anything mainly about: crypto/);
  assert.deepEqual(parseClassifyReply('{"matches":[1,0]}', 2), [1, 0]);
  assert.deepEqual(parseClassifyReply('Sure! Here you go: [true, false]', 2), [1, 0]);
  assert.deepEqual(parseClassifyReply('```json\n[0.9, 0.1]\n```', 2), [0.9, 0.1]);
  assert.equal(parseClassifyReply('[1,0,1]', 2), null);
  assert.equal(parseClassifyReply('no idea', 2), null);
});

test('llm classifier batches and tolerates an unparseable batch', async () => {
  const seen = [];
  const fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    seen.push(url);
    const n = body.messages[0].content.match(/exactly (\d+) numbers/)[1];
    const content = seen.length === 1 ? JSON.stringify({ matches: Array.from({ length: +n }, (_, i) => i % 2) }) : 'garbage';
    return { ok: true, json: async () => ({ message: { content } }) };
  };
  const c = createLlmClassifier({ enabled: true, provider: 'ollama', ollamaUrl: 'http://localhost:11434/', ollamaModel: 'm' }, { fetch });
  const items = Array.from({ length: LLM_BATCH + 2 }, (_, i) => ({ title: `t${i}` }));
  const out = await c.classify({ label: 'x', phrases: [], negative: [] }, items);
  assert.equal(seen.length, 2);
  assert.equal(seen[0], 'http://localhost:11434/api/chat');
  assert.equal(out[0], 0);
  assert.equal(out[1], 1);
  assert.equal(out[LLM_BATCH], null);
});

test('openai-compatible classifier sends bearer key', async () => {
  let captured;
  const fetch = async (url, init) => {
    captured = { url, init };
    return { ok: true, json: async () => ({ choices: [{ message: { content: '{"matches":[1]}' } }] }) };
  };
  const c = createLlmClassifier({ enabled: true, provider: 'openai', openaiUrl: 'https://api.groq.com/openai/v1', openaiKey: 'sk', openaiModel: 'm' }, { fetch });
  const out = await c.classify({ label: 'x', phrases: [], negative: [] }, [{ title: 'a' }]);
  assert.deepEqual(out, [1]);
  assert.equal(captured.url, 'https://api.groq.com/openai/v1/chat/completions');
  assert.equal(captured.init.headers.authorization, 'Bearer sk');
});

test('embedding math', () => {
  assert.ok(Math.abs(cosine([1, 0], [1, 0]) - 1) < 1e-9);
  assert.equal(cosine([1, 0], [0, 1]), 0);
  assert.ok(Math.abs(topicSimilarity([1, 0], [[0, 1], [0.6, 0.8]]) - 0.6) < 1e-9);
  assert.equal(embeddingScore([1, 0], [[0.6, 0.8]], [[1, 0]]), 0, 'negative phrase vetoes');
  assert.ok(embeddingScore([1, 0], [[0.9, 0.1]], [[0, 1]]) > 0.9);
});
