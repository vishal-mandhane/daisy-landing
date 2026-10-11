// Sanity checks that catch the mistakes a store review would reject:
// every referenced file exists, every module parses, no remote script URLs.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'extension');
const manifest = JSON.parse(readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const problems = [];
const must = (p, why) => {
  if (!existsSync(path.join(root, p))) problems.push(`${why}: missing ${p}`);
};
for (const [, p] of Object.entries(manifest.icons ?? {})) must(p, 'icons');
for (const [, p] of Object.entries(manifest.action?.default_icon ?? {})) must(p, 'action icon');
must(manifest.action.default_popup, 'popup');
must(manifest.options_ui.page, 'options');
must(manifest.background.service_worker, 'service worker');
for (const cs of manifest.content_scripts) {
  for (const f of cs.js ?? []) must(f, 'content script');
  for (const f of cs.css ?? []) must(f, 'content css');
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== 'vendor') walk(p);
      continue;
    }
    if (/\.(js|mjs|html)$/.test(name)) {
      const src = readFileSync(p, 'utf8');
      const remote = src.match(/<script[^>]+src=["']https?:/i);
      if (remote) problems.push(`remote script in ${path.relative(root, p)}`);
      if (/\.js$/.test(name)) {
        for (const m of src.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)) {
          const target = path.resolve(path.dirname(p), m[1]);
          if (!existsSync(target)) problems.push(`${path.relative(root, p)} imports missing ${m[1]}`);
        }
      }
    }
  }
}
walk(root);

// Parse every module with node to catch syntax errors early.
import { spawnSync } from 'node:child_process';
function parseAll(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== 'vendor') parseAll(p);
    } else if (name.endsWith('.js')) {
      const r = spawnSync(process.execPath, ['--check', p]);
      if (r.status !== 0) problems.push(`syntax: ${path.relative(root, p)}: ${r.stderr.toString().split('\n').slice(0, 3).join(' ')}`);
    }
  }
}
parseAll(root);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`manifest ok: v${manifest.version}, ${manifest.content_scripts[0].matches.length} host patterns`);
