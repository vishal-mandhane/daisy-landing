# Sieve — filter any streaming feed by rating or by topic

One browser extension, two lenses, zero servers.

- **★ Ratings lens** — on Netflix, Prime Video, JioHotstar, Disney+, Hulu, Max and Apple TV+,
  every tile gets an IMDb / Rotten Tomatoes / TMDB badge. Set "min IMDb 7" and the rest
  fades away.
- **🎯 Topic lens** — on YouTube (and, if you switch it on, any OTT catalogue), type what you
  want to watch — `finance, mutual funds -crypto` — or tap a preset (AI, Tech, Finance, Fitness,
  Cooking…). Everything else is hidden from Home, Search, Subscriptions, Shorts and the
  recommendations next to a video. Three engines, all running on your machine:
  1. **Keyword** — instant, no setup.
  2. **Embeddings** — a 23 MB open-source model (MiniLM via Transformers.js) understands meaning:
     "how I invest my salary" matches *finance* with no keyword in common.
  3. **LLM** — Llama, Qwen, Gemma or any open-weight model in [Ollama](https://ollama.com) (or an
     OpenAI-compatible endpoint) judges titles in batches. Most accurate.

No backend. No account. No telemetry. Settings sync through your browser profile; the only
network calls are the ones you configure (your ratings provider, the one-time model download
from Hugging Face, your LLM endpoint). MIT licensed.

## Install (unpacked, 2 minutes)

```bash
cd sieve
npm install          # dev tooling only
npm run vendor       # copies Transformers.js into extension/vendor/ (enables the embedding engine)
```

Then in Chrome / Edge / Brave: `chrome://extensions` → **Developer mode** → **Load unpacked** →
pick the `sieve/extension` folder. Firefox: `about:debugging` → **This Firefox** →
**Load Temporary Add-on** → pick `extension/manifest.json`.

`npm run build` produces `dist/sieve-<version>.zip` for a store upload.

## Set up in 1 minute

1. **Ratings**: get a free key from [OMDb](https://www.omdbapi.com/apikey.aspx) (IMDb + RT +
   Metacritic, 1,000 lookups/day — Sieve caches for three weeks so that is plenty) or
   [TMDB](https://www.themoviedb.org/settings/api). Paste it in Settings → Ratings lens → **Test lookup**.
2. **Topics**: nothing to set up for the keyword engine. Click **Download / load model now** once
   for the embedding engine. For the LLM engine, run `ollama pull llama3.2`, tick *Use an LLM*,
   **Test LLM**.
3. Open YouTube. Click the **Sieve** pill bottom-right (or the toolbar icon, or `Alt+Shift+S`).
   Type a topic. Done. `Alt+Shift+T` pauses and resumes the Topic lens everywhere.

## How it decides

| Signal | When it is used | Verdict |
|---|---|---|
| Keyword hit | always | match (near-certain) |
| Keyword exclude (`-crypto`) | always | reject |
| Embedding cosine ≥ threshold | no keyword hit, engine installed | match/reject; the **Strictness** slider sets the threshold |
| LLM 1/0 | enabled | overrides everything |
| Nothing could judge | engines unavailable | keep visible (we never hide on a guess) |

Cards stay visible until a semantic engine has judged them, so the page never flashes empty.
Decisions are cached per (topic, title) for a week; ratings for three weeks.

On sites whose rows are carousels (Netflix, Prime, Hotstar, Disney+), "Hide" dims the tile to
near-invisible instead of removing it, because removing a slide breaks the row.

## Project layout

```
extension/
  manifest.json          MV3, works in Chrome/Edge/Brave/Opera and Firefox 121+
  content/               loader → app → scanner (finds cards) → lenses (ratings, topics) → toolbar
  sites/                 one small adapter per site: card selector + title extraction. The volatile part.
  lib/                   pure, unit-tested logic: text, titles, settings, cache, ratings providers, topic engines
  background/sw.js       caches, ratings provider calls, LLM calls, embedding bridge — keys never reach the page
  offscreen/             hosts the Transformers.js model (Chrome offscreen document / Firefox background page)
  ui/                    the panel, rendered both in-page (shadow DOM) and in the popup
  popup/ options/        browser-action popup and the full settings page
  vendor/                Transformers.js + ONNX Runtime, copied by `npm run vendor` (not committed)
test/                    node:test unit tests          → npm test
e2e/                     Playwright: real extension in Chromium against fixture DOMs + a mock OMDb → npm run e2e
docs/                    ARCHITECTURE, ADDING-A-SITE, PRIVACY
```

## Develop

```bash
npm test               # 41 unit tests, < 1 s
npm run e2e            # loads the extension into Chromium, 7 scenarios (needs `npx playwright install chromium`)
npm run lint           # manifest + import + syntax checks
npm run icons          # re-render icons/icon.svg to PNG
```

A site changed its markup? See [docs/ADDING-A-SITE.md](docs/ADDING-A-SITE.md): it is one file,
and the fixture pages in `e2e/fixtures/` show the DOM shapes we rely on. Every card Sieve
recognises carries `data-sieve-title` in devtools, which makes bug reports easy.

## Roadmap

- Community-maintained ratings snapshot on static hosting (no API key at all).
- Per-channel allow/deny lists and a "why was this hidden?" tooltip.
- Mobile browsers that support extensions (Firefox Android, Kiwi, Orion).
- Safari via `xcrun safari-web-extension-converter` (the code base already avoids Chrome-only APIs
  except `offscreen`, which has a Firefox-path fallback).

## Credits

[Transformers.js](https://github.com/huggingface/transformers.js) (Apache-2.0),
[ONNX Runtime Web](https://onnxruntime.ai) (MIT), ratings by [OMDb](https://www.omdbapi.com) /
[TMDB](https://www.themoviedb.org) under their terms. Not affiliated with any streaming service.
