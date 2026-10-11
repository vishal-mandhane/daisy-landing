import { firstAttr, labelledTitle, contextFromPath } from './_shared.js';

export default {
  id: 'primevideo',
  label: 'Prime Video',
  matches: (loc) => /(^|\.)primevideo\.com$/.test(loc.hostname) || (/(^|\.)amazon\.(com|in|co\.uk|de)$/.test(loc.hostname) && /\/(gp\/video|Prime-Video|video)/i.test(loc.pathname)),
  supports: { ratings: true, topics: true },
  hideStyle: 'dim',
  cardSelector: 'article[data-card-title], [data-testid="card"], li[data-testid="packshot"], [data-testid*="packshot"], .tst-title-card, [data-card-title]',
  context(loc) {
    return contextFromPath(loc.pathname, [
      [/^\/(storefront|home)?\/?$/, 'home'],
      [/search/, 'search'],
      [/\/detail\//, 'watch'],
    ]);
  },
  extract(card) {
    if (card.querySelector('[data-card-title]') && !card.hasAttribute('data-card-title')) return null;
    const title = firstAttr(card, ['[data-card-title]'], 'data-card-title') || labelledTitle(card);
    if (!title) return null;
    return { title, kind: null };
  },
};
