// Helpers shared by site adapters. Adapters are deliberately small and
// declarative: a selector list for cards, a way to pull a title out of a card,
// and a few flags. Selectors are the volatile part of this project — when a
// site redesigns, this is the only place that needs a fix.

export function text(el) {
  return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function firstText(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (!el) continue;
    const t = el.getAttribute?.('title') || el.getAttribute?.('aria-label') || text(el);
    if (t) return t;
  }
  return '';
}

export function firstAttr(root, selectors, attr) {
  for (const sel of selectors) {
    const el = root.matches?.(sel) ? root : root.querySelector(sel);
    const v = el?.getAttribute?.(attr);
    if (v && v.trim()) return v.trim();
  }
  return '';
}

/** Title from aria-label / alt / link text, in that order of reliability. */
export function labelledTitle(card) {
  return (
    firstAttr(card, ['a[aria-label]', '[aria-label]'], 'aria-label') ||
    firstAttr(card, ['img[alt]'], 'alt') ||
    firstText(card, ['[data-card-title]', 'h3', 'h4', '.title', 'a'])
  );
}

export function contextFromPath(pathname, rules) {
  for (const [re, ctx] of rules) if (re.test(pathname)) return ctx;
  return 'other';
}
