// LLM engine: a local or remote open-weight model answers "is this about X?"
// for a batch of titles. Default is Ollama on localhost (Llama, Qwen, Gemma…),
// alternatives are any OpenAI-compatible endpoint (Groq, OpenRouter, LM Studio,
// vLLM) and Chrome's built-in Prompt API when the browser offers one.

export const LLM_BATCH = 24;

export function buildClassifyPrompt(topic, items) {
  const lines = items.map((it, i) => {
    const bits = [it.title];
    if (it.channel) bits.push(`by ${it.channel}`);
    if (it.description) bits.push(`— ${String(it.description).slice(0, 160)}`);
    return `${i + 1}. ${bits.join(' ')}`;
  });
  const topicText = topic.phrases?.length ? topic.phrases.join('; ') : topic.label;
  const negative = topic.negative?.length ? `\nExclude anything mainly about: ${topic.negative.join(', ')}.` : '';
  return [
    `You are a strict content classifier for a video feed. Topic: "${topic.label}".`,
    `The topic covers: ${topicText}.${negative}`,
    `For each numbered item below, answer 1 if the video is primarily about the topic and 0 otherwise.`,
    `Reply with ONLY a JSON object of the form {"matches":[0,1,...]} with exactly ${items.length} numbers in order.`,
    '',
    ...lines,
  ].join('\n');
}

/** Pull an array of n numbers in 0..1 out of a model reply, or null. */
export function parseClassifyReply(text, n) {
  if (typeof text !== 'string') return null;
  const candidates = [];
  try {
    const obj = JSON.parse(text);
    if (Array.isArray(obj)) candidates.push(obj);
    else if (obj && Array.isArray(obj.matches)) candidates.push(obj.matches);
  } catch {
    /* fall through to regex */
  }
  const m = text.match(/\[[^\[\]]*\]/g);
  if (m) for (const s of m) {
    try {
      candidates.push(JSON.parse(s));
    } catch {
      /* ignore */
    }
  }
  for (const c of candidates) {
    if (!Array.isArray(c) || c.length !== n) continue;
    const nums = c.map((v) => (typeof v === 'boolean' ? (v ? 1 : 0) : Number(v)));
    if (nums.every((v) => Number.isFinite(v) && v >= 0 && v <= 1)) return nums;
  }
  return null;
}

export async function classifyWithOllama(prompt, { url, model, fetch = globalThis.fetch }) {
  const base = String(url || 'http://localhost:11434').replace(/\/+$/, '');
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      options: { temperature: 0 },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const json = await res.json();
  return json?.message?.content ?? '';
}

export async function classifyWithOpenAI(prompt, { url, key, model, fetch = globalThis.fetch }) {
  const base = String(url || '').replace(/\/+$/, '');
  if (!base) throw new Error('No endpoint URL');
  const headers = { 'content-type': 'application/json' };
  if (key) headers.authorization = `Bearer ${key}`;
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`LLM endpoint HTTP ${res.status}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? '';
}

export async function classifyWithChromeAI(prompt) {
  const LM = globalThis.LanguageModel;
  if (!LM) throw new Error('Chrome Prompt API not available');
  const session = await LM.create();
  try {
    return await session.prompt(prompt);
  } finally {
    session.destroy?.();
  }
}

/**
 * @param {object} cfg settings.topics.llm
 * @returns {{available(): boolean, classify(topic, items): Promise<(number|null)[]>}}
 */
export function createLlmClassifier(cfg, { fetch = globalThis.fetch } = {}) {
  const call = async (prompt) => {
    if (cfg.provider === 'openai') return classifyWithOpenAI(prompt, { url: cfg.openaiUrl, key: cfg.openaiKey, model: cfg.openaiModel, fetch });
    if (cfg.provider === 'chrome') return classifyWithChromeAI(prompt);
    return classifyWithOllama(prompt, { url: cfg.ollamaUrl, model: cfg.ollamaModel, fetch });
  };
  return {
    available: () => Boolean(cfg?.enabled),
    async classify(topic, items) {
      const out = new Array(items.length).fill(null);
      for (let i = 0; i < items.length; i += LLM_BATCH) {
        const batch = items.slice(i, i + LLM_BATCH);
        const reply = await call(buildClassifyPrompt(topic, batch));
        const nums = parseClassifyReply(reply, batch.length);
        if (nums) for (let j = 0; j < nums.length; j++) out[i + j] = nums[j];
      }
      return out;
    },
  };
}
