// Renders icons/icon.svg to the PNG sizes Chrome wants, using the Chromium
// that Playwright ships (no native image libraries needed).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = path.join(root, 'extension', 'icons');
mkdirSync(iconsDir, { recursive: true });
const svg = readFileSync(path.join(iconsDir, 'icon.svg'), 'utf8');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const size of [16, 32, 48, 128]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  writeFileSync(path.join(iconsDir, `icon-${size}.png`), buf);
  console.log(`icon-${size}.png`);
}
await browser.close();
