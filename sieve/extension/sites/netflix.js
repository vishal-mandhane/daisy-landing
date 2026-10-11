import { labelledTitle, firstText, contextFromPath } from './_shared.js';

export default {
  id: 'netflix',
  label: 'Netflix',
  matches: (loc) => /(^|\.)netflix\.com$/.test(loc.hostname),
  supports: { ratings: true, topics: true },
  // Netflix rows are absolutely positioned sliders: collapsing a card breaks
  // the row, so a hidden card is dimmed to near-invisible instead.
  hideStyle: 'dim',
  cardSelector: '.title-card, .slider-item, .titleCard--container, .galleryLockups .title-card-container, [data-uia^="title-card"]',
  context(loc) {
    return contextFromPath(loc.pathname, [
      [/^\/browse\/?$/, 'home'],
      [/^\/search/, 'search'],
      [/^\/browse\/genre/, 'home'],
      [/^\/browse\/my-list/, 'other'],
      [/^\/(title|watch)\//, 'watch'],
      [/^\/browse/, 'home'],
    ]);
  },
  extract(card) {
    if (card.classList.contains('slider-item') && card.querySelector('.title-card, [data-uia^="title-card"]')) return null; // inner one handles it
    const title = labelledTitle(card) || firstText(card, ['.fallback-text', '.previewModal--section-header']);
    if (!title) return null;
    return { title, kind: null };
  },
  badgeHost(card) {
    return card.querySelector('.boxart-container, .boxart-size-16x9, .boxart-size-7x10, .title-card-container') ?? card;
  },
};
