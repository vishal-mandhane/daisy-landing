// Produces dist/sieve-<version>.zip, ready for "Load unpacked" or a store upload.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(readFileSync(path.join(root, 'extension', 'manifest.json'), 'utf8')).version;
mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', `sieve-${version}.zip`);
rmSync(out, { force: true });
const r = spawnSync('zip', ['-r', '-q', out, '.', '-x', 'vendor/README.md', '*.map'], { cwd: path.join(root, 'extension'), stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`wrote ${path.relative(root, out)}`);
