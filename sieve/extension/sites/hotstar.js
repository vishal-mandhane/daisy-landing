import { labelledTitle, contextFromPath } from './_shared.js';

export default {
  id: 'hotstar',
  label: 'JioHotstar',
  matches: (loc) => /(^|\.)(hotstar|jiohotstar)\.com$/.test(loc.hostname),
  supports: { ratings: true, topics: true },
  hideStyle: 'dim',
  cardSelector: 'a[href*="/movies/"], a[href*="/shows/"], a[href*="/tv/"], a[href*="/sports/"], article a[aria-label], [data-testid*="card"] a[aria-label]',
  context(loc) {
    return contextFromPath(loc.pathname, [
      [/^\/(in|us|gb|ca|sg)?\/?$/, 'home'],
      [/\/search/, 'search'],
      [/\/(movies|shows|tv)\//, 'watch'],
    ]);
  },
  extract(card) {
    const title = labelledTitle(card);
    if (!title || /^(play|watch now)$/i.test(title)) return null;
    const kind = /\/shows\/|\/tv\//.test(card.getAttribute('href') ?? '') ? 'series' : /\/movies\//.test(card.getAttribute('href') ?? '') ? 'movie' : null;
    return { title, kind };
  },
};
