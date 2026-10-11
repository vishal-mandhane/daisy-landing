# Adding or fixing a site adapter

An adapter answers four questions. Copy `extension/sites/disneyplus.js` and fill in:

```js
export default {
  id: 'example',                     // used in settings.sites.<id>
  label: 'Example+',                 // shown in the panel
  matches: (loc) => /(^|\.)example\.com$/.test(loc.hostname),
  supports: { ratings: true, topics: true },
  hideStyle: 'dim',                  // 'collapse' if display:none is safe, 'dim' for carousels
  cardSelector: 'a[aria-label][href*="/title/"]',   // one element per title
  context: (loc) => 'home',          // 'home' | 'search' | 'watch' | 'subscriptions' | 'shorts' | 'channel' | 'other'
  extract(card) {                    // null = not a title card after all
    const title = card.getAttribute('aria-label');
    return title ? { title, kind: null } : null;
  },
  badgeHost: (card) => card,         // optional: where the ★ badge is appended (needs room top-left)
};
```

Then:

1. Register it in `extension/sites/index.js` and add its host pattern to `manifest.json`
   (`content_scripts[0].matches`).
2. Add a default in `lib/settings.js` → `DEFAULTS.sites`.
3. Add a fixture page in `e2e/fixtures/<id>.html` with `<meta name="sieve-site" content="<id>">`
   and the real DOM shape (copy a few cards from devtools; strip everything else). Add a step in
   `e2e/run.mjs`. `npm run e2e`.

## Finding the right selector

Open the site, open devtools, right-click a tile → Inspect. You want the *outermost* element that
represents exactly one title, so that hiding it removes the whole tile (thumbnail + text) and so
that recycled nodes are detected (we re-read the title whenever `aria-label`, `title`, `alt` or
`href` change). Prefer attributes the site uses for accessibility (`aria-label`, `img[alt]`) —
they rot slower than class names.

Nested wrappers: if both an outer wrapper and an inner element match `cardSelector`, return
`null` from `extract()` for the one you do not want (see `youtube.js`).

## Debugging in the wild

Every recognised card gets `data-sieve-title="…"` and, once judged, `data-sieve="hide|dim"` and
`data-sieve-by="keyword|embedding|llm"`. `document.querySelectorAll('[data-sieve-title]').length`
in the console tells you whether the scanner sees the page at all. `[sieve]` prefixed warnings
in the console show engine failures.
