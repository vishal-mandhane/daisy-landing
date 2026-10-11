// Copies the Transformers.js runtime into extension/vendor/ so the embedding
// engine can load without any remote code (a Chrome Web Store requirement).
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let dist;
try {
  // The package's exports map hides package.json, so resolve the entry file and go up one.
  dist = path.dirname(require.resolve('@huggingface/transformers'));
} catch {
  console.error('Run `npm install` first (needs @huggingface/transformers).');
  process.exit(1);
}
const out = path.join(root, 'extension', 'vendor');
mkdirSync(out, { recursive: true });
const files = ['transformers.min.js', 'ort-wasm-simd-threaded.jsep.mjs', 'ort-wasm-simd-threaded.jsep.wasm', 'ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm'];
let total = 0;
for (const f of files) {
  const src = path.join(dist, f);
  if (!existsSync(src)) {
    console.log(`skip ${f} (not in this version)`);
    continue;
  }
  copyFileSync(src, path.join(out, f));
  const kb = Math.round(statSync(src).size / 1024);
  total += kb;
  console.log(`vendor/${f}  ${kb} KB`);
}
console.log(`done: ${Math.round(total / 1024 * 10) / 10} MB copied to extension/vendor/`);
