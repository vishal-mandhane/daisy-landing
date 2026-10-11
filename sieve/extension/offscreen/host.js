// Loads Transformers.js from vendor/ and serves embeddings. Shared by the
// Chrome offscreen document and the Firefox background page.
import { runtimeUrl } from '../lib/browser.js';

let state = { ready: false, loading: false, error: null, model: null, device: null };
let pipe = null;
let loadPromise = null;
let tf = null;

async function loadLibrary() {
  if (tf) return tf;
  tf = await import(/* webpackIgnore: true */ runtimeUrl('vendor/transformers.min.js'));
  tf.env.allowLocalModels = false;
  tf.env.allowRemoteModels = true;
  tf.env.useBrowserCache = true;
  tf.env.backends.onnx.wasm.wasmPaths = runtimeUrl('vendor/');
  // Threads need cross-origin isolation, which extension pages do not have.
  tf.env.backends.onnx.wasm.numThreads = 1;
  return tf;
}

async function load(model) {
  if (pipe && state.model === model) return pipe;
  if (loadPromise && state.model === model) return loadPromise;
  state = { ready: false, loading: true, error: null, model, device: null };
  loadPromise = (async () => {
    try {
      const lib = await loadLibrary();
      let device = 'wasm';
      try {
        if (navigator.gpu && (await navigator.gpu.requestAdapter())) device = 'webgpu';
      } catch {
        device = 'wasm';
      }
      try {
        pipe = await lib.pipeline('feature-extraction', model, { device, dtype: device === 'webgpu' ? 'fp32' : 'q8' });
      } catch (err) {
        if (device === 'webgpu') {
          device = 'wasm';
          pipe = await lib.pipeline('feature-extraction', model, { device, dtype: 'q8' });
        } else throw err;
      }
      state = { ready: true, loading: false, error: null, model, device };
      return pipe;
    } catch (err) {
      state = { ready: false, loading: false, error: friendly(err), model, device: null };
      pipe = null;
      throw new Error(state.error);
    } finally {
      loadPromise = null;
    }
  })();
  return loadPromise;
}

function friendly(err) {
  const m = String(err?.message ?? err);
  if (/Failed to fetch dynamically imported module|vendor\//.test(m)) return 'not installed (run npm run vendor)';
  if (/fetch|network|Failed to load/i.test(m)) return 'model download failed (offline?)';
  return m.slice(0, 120);
}

export async function status({ model } = {}) {
  if (model && state.model && model !== state.model && !state.loading) {
    pipe = null;
    state = { ...state, ready: false, model, error: null };
  }
  return { ...state };
}

export async function warm({ model }) {
  await load(model);
  return { ...state };
}

export async function embed({ texts, model }) {
  const extractor = await load(model);
  const out = await extractor(texts, { pooling: 'mean', normalize: true });
  const vectors = out.tolist();
  out.dispose?.();
  return { vectors };
}
