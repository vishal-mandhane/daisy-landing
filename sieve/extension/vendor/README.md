# vendor/

Third-party runtime files that are copied here by `npm run vendor`
(see `scripts/vendor.mjs`). They are not committed.

- `transformers.min.js` — Transformers.js (Apache-2.0), runs open-source
  embedding models in the browser.
- `ort-wasm-simd-threaded.jsep.mjs` / `.wasm` — ONNX Runtime Web (MIT).

Without these files Sieve still works: the Topic lens falls back to the
keyword engine (and to a local LLM if you configured one). The Options
page tells you when the embedding engine is unavailable.
