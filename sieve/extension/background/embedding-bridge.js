// Runs the embedding model where the browser allows it: Chrome needs an
// offscreen document (service workers cannot use WebAssembly threads or the
// DOM Cache APIs the model loader relies on); Firefox's background page can
// host the model directly.
import { api, runtimeUrl } from '../lib/browser.js';

const OFFSCREEN_URL = 'offscreen/offscreen.html';
const TARGET = 'sieve-offscreen';

export function createEmbeddingBridge() {
  let installed = null; // null = unknown
  let creating = null;
  let direct = null; // Firefox: host module
  let last = { ready: false, loading: false, error: null, model: null };

  async function checkInstalled() {
    if (installed != null) return installed;
    try {
      const res = await fetch(runtimeUrl('vendor/transformers.min.js'), { method: 'HEAD' });
      installed = res.ok;
    } catch {
      installed = false;
    }
    return installed;
  }

  async function ensureHost() {
    if (!api.offscreen) {
      direct ??= await import('../offscreen/host.js');
      return 'direct';
    }
    const contexts = await api.runtime.getContexts?.({ contextTypes: ['OFFSCREEN_DOCUMENT'] }).catch(() => []);
    if (contexts?.length) return 'offscreen';
    creating ??= api.offscreen
      .createDocument({
        url: OFFSCREEN_URL,
        reasons: ['WORKERS'],
        justification: 'Runs the local open-source text-embedding model that classifies video titles by topic.',
      })
      .catch((err) => {
        if (!/single offscreen document|already exists/i.test(String(err))) throw err;
      })
      .finally(() => (creating = null));
    await creating;
    return 'offscreen';
  }

  async function call(type, payload) {
    const mode = await ensureHost();
    if (mode === 'direct') return direct[type](payload);
    const res = await api.runtime.sendMessage({ target: TARGET, type, ...payload });
    if (res && res.__error) throw new Error(res.__error);
    return res;
  }

  return {
    async status(model) {
      const inst = await checkInstalled();
      if (!inst) return { installed: false, ready: false, loading: false, error: null, model, usable: false };
      try {
        last = await call('status', { model });
      } catch (err) {
        last = { ready: false, loading: false, error: err.message, model };
      }
      return { installed: true, ...last, usable: !last.error };
    },
    async embed(texts, model) {
      if (!(await checkInstalled())) throw new Error('embedding engine not installed');
      const res = await call('embed', { texts, model });
      return res.vectors;
    },
    async warm(model) {
      if (!(await checkInstalled())) throw new Error('embedding engine not installed');
      return call('warm', { model });
    },
    resetInstalled() {
      installed = null;
    },
  };
}
