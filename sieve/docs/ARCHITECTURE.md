# Architecture

## One extension, two lenses — why not two extensions?

Both features share the hard part: finding "a card for one title" on a page that is a lazily
rendered, virtualised, ever-changing single-page app, and keeping a verdict attached to it as
the site recycles DOM nodes. That is `content/scanner.js` plus one adapter per site. Once that
exists, a lens is small: *given a card, decide and style it*. Two extensions would duplicate the
scanner, the adapters, the settings UI, the permission prompt and the maintenance burden, and
users would have to install both. So: one extension, a `RatingsLens` and a `TopicLens`, each
switchable per site, each able to say "show / dim / hide" about a card; `content/apply.js`
merges their opinions (hide wins over dim wins over show).

## Data flow

```
page DOM ──MutationObserver──▶ Scanner ──card──▶ RatingsLens ──rating.get──▶ background ──▶ cache ─▶ OMDb/TMDB
                                       └──card──▶ TopicLens ─(keyword, instant)
                                                            └─(batch)─topic.refine─▶ background ─▶ cache
                                                                                              ├─▶ offscreen: Transformers.js embeddings
                                                                                              └─▶ Ollama / OpenAI-compatible / Chrome AI
```

- **Content script** (`content/`): isolated world, no keys. Loads as an ES module through a
  one-line classic loader so the code is shared with the worker and the tests.
- **Background worker** (`background/sw.js`): holds the two TTL caches (`storage.local`), talks to
  the ratings provider, the LLM, and the embedding host. API keys live in `storage.sync` and never
  enter a page.
- **Offscreen document** (`offscreen/`): Chrome service workers cannot run the ONNX runtime well
  (no DOM caches, no WebGPU), so the model runs in an offscreen page. Firefox has no offscreen
  API but its background page is a real page, so the same `host.js` is imported directly.
- **Panel** (`ui/panel.js`): one render function; the toolbar mounts it in a shadow root on the
  page, the popup mounts it in its own document. Settings changes flow through
  `storage.onChanged` so every surface stays in sync without a bus.

## Decisions worth knowing

- **Never hide on a guess.** If no engine could judge a card (`decide()` returns `by: 'none'`),
  it stays visible. Keyword "no hit" counts as a judgement only when keyword is the only engine.
- **Show until judged.** When a semantic engine is available, a card without a keyword hit is
  left visible and queued; the verdict lands ~100–500 ms later. The alternative (hide-then-reveal)
  makes feeds look empty and jumpy.
- **Dim instead of hide on carousels.** Adapters declare `hideStyle`. Netflix/Prime/Hotstar
  position slides absolutely; removing one breaks the row. The panel explains this.
- **Keys and caches in the browser only.** No proxy, no backend, no analytics. The endpoints are
  overridable so a user behind a blocking network can point at their own proxy.
- **Per-site Topic lens.** A "finance" filter meant for YouTube must not empty Netflix. The lens
  is on for YouTube by default and opt-in elsewhere (`topicsActiveOn()`); the master switch is a
  pause (`Alt+Shift+T`).
- **Adapters are declarative and tiny.** Selectors are the only part expected to rot. Each adapter
  is < 60 lines; `e2e/fixtures/` pins the DOM shapes; `data-sieve-title` on every recognised card
  makes "it stopped working" reports actionable.

## Performance

- The scanner runs on `requestIdleCallback` after DOM mutations and dedupes elements with a
  `WeakSet`; recycled nodes are detected by title change.
- Ratings: concurrency 3, in-flight dedupe, 21-day positive / 3-day negative / 10-minute error
  cache. A heavy Netflix session is a few hundred lookups a month.
- Topics: keyword scoring is synchronous and ~microseconds per card. Embedding batches of ≤ 32
  titles run in the offscreen document; MiniLM on WASM is ~20 ms per title, WebGPU much faster.
  Decisions are cached per (topic, title) for a week so revisits are free.
- Nothing runs on unsupported hosts: the content script only matches the listed sites.

## Security

- Content scripts never receive keys; the worker makes provider calls.
- No remote code: Transformers.js and ONNX Runtime are vendored; models are *data* fetched from
  huggingface.co and cached by the browser's Cache API.
- CSP for extension pages allows only `'self'` plus `'wasm-unsafe-eval'` (required by ONNX).
- The in-page UI lives in a shadow root and all strings are escaped; the host page cannot read
  the panel and the panel does not trust the page.
