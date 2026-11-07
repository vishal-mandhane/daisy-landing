// Writes the QR codes in public/qr/. Not part of the build: run it by hand
// when a URL changes. It needs the qrcode package, which the site doesn't, so
// install it without saving it to package.json:
//
//   npm install --no-save qrcode && node scripts/make-qr.js
//
// Black on white, a quiet zone of 4 modules (the minimum the QR standard
// sets) and no logo: a plain code is the one that scans every time.

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const sharp = require('sharp');

const out = path.join(__dirname, '..', 'public', 'qr');
const QUIET = 4;

const CODES = [
  // Next to the store badges on laptops. A screen doesn't get scuffed, so
  // medium error correction keeps the code less dense and easier to read.
  { name: 'dayzi-download', url: 'https://dayzi.live/download', level: 'M' },
  // The standee. High error correction survives glare, scuffs and a bad
  // angle. The SVG is for the printer; the PNG is 2000 x 2000.
  { name: 'dayzi-standee', url: 'https://dayzi.live/download?src=standee', level: 'H', png: 2000 },
];

// One filled rectangle per run of dark modules in a row: crisp at any size,
// and nothing (strokes, fonts) for a print shop's software to misread.
function toSvg(modules) {
  const n = modules.size;
  const total = n + QUIET * 2;
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; ) {
      if (!modules.get(y, x)) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < n && modules.get(y, x + run)) run += 1;
      d += `M${x + QUIET} ${y + QUIET}h${run}v1h-${run}z`;
      x += run;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="#fff"/><path fill="#000" d="${d}"/></svg>\n`
  );
}

// Whole pixels per module, so every edge is sharp; what's left over widens
// the quiet zone.
async function toPng(modules, size, file) {
  const n = modules.size;
  const scale = Math.floor(size / (n + QUIET * 2));
  const offset = Math.floor((size - n * scale) / 2);
  const pixels = Buffer.alloc(size * size, 255);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!modules.get(y, x)) continue;
      for (let dy = 0; dy < scale; dy++) {
        const row = (offset + y * scale + dy) * size;
        pixels.fill(0, row + offset + x * scale, row + offset + (x + 1) * scale);
      }
    }
  }
  await sharp(pixels, { raw: { width: size, height: size, channels: 1 } })
    .withMetadata({ density: 300 })
    .png()
    .toFile(file);
  return { scale, quiet: offset / scale };
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  for (const { name, url, level, png } of CODES) {
    const { modules, version } = QRCode.create(url, { errorCorrectionLevel: level });
    fs.writeFileSync(path.join(out, `${name}.svg`), toSvg(modules));
    let note = '';
    if (png) {
      const { scale, quiet } = await toPng(modules, png, path.join(out, `${name}.png`));
      note = `, ${png}x${png} PNG at ${scale}px a module, quiet zone ${quiet.toFixed(1)} modules`;
    }
    console.log(`${name}: ${url} (level ${level}, version ${version}, ${modules.size}x${modules.size}${note})`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
