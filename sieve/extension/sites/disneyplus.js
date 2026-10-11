import { labelledTitle, contextFromPath } from './_shared.js';

export default {
  id: 'disneyplus',
  label: 'Disney+',
  matches: (loc) => /(^|\.)disneyplus\.com$/.test(loc.hostname),
  supports: { ratings: true, topics: true },
  hideStyle: 'dim',
  cardSelector: 'a[href*="/movies/"], a[href*="/series/"], a[href*="/browse/entity-"], a[href*="/play/"], [data-testid*="set-item"]',
  context(loc) {
    return contextFromPath(loc.pathname, [
      [/^\/(home)?\/?$/, 'home'],
      [/search/, 'search'],
      [/\/(movies|series|browse\/entity)/, 'watch'],
    ]);
  },
  extract(card) {
    const title = labelledTitle(card);
    if (!title) return null;
    const href = card.getAttribute('href') ?? '';
    return { title, kind: /\/series\//.test(href) ? 'series' : /\/movies\//.test(href) ? 'movie' : null };
  },
};
