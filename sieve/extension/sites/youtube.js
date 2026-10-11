import { firstText, text, contextFromPath } from './_shared.js';

// Wrapper elements that represent one video in a feed. Desktop (ytd-*), the
// 2024+ "lockup" view models and mobile web (ytm-*).
const CARD_SELECTOR = [
  'ytd-rich-item-renderer',
  'ytd-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-playlist-video-renderer',
  'ytd-reel-item-renderer',
  'ytd-compact-radio-renderer',
  'ytd-compact-playlist-renderer',
  'ytd-playlist-renderer',
  'ytd-radio-renderer',
  'yt-lockup-view-model',
  'ytm-shorts-lockup-view-model',
  'ytm-shorts-lockup-view-model-v2',
  'ytm-rich-item-renderer',
  'ytm-video-with-context-renderer',
  'ytm-compact-video-renderer',
  'ytm-item-section-renderer ytm-video-with-context-renderer',
].join(', ');

const TITLE_SELECTORS = [
  '#video-title',
  'a#video-title-link',
  'h3 a.yt-lockup-metadata-view-model__title',
  '.yt-lockup-metadata-view-model__title',
  '.yt-lockup-metadata-view-model-wiz__title',
  'a.yt-lockup-metadata-view-model-wiz__title',
  '.shortsLockupViewModelHostMetadataTitle',
  'h3[aria-label]',
  '.media-item-headline',
  'h3 a[title]',
  'a[title]',
  'h3',
];

const CHANNEL_SELECTORS = [
  'ytd-channel-name a',
  'ytd-channel-name yt-formatted-string',
  '#channel-name #text',
  '.yt-content-metadata-view-model__metadata-text',
  '.yt-content-metadata-view-model-wiz__metadata-text',
  '.ytm-badge-and-byline-renderer .ytm-badge-and-byline-item-byline',
  '.ytd-channel-name',
];

const DESCRIPTION_SELECTORS = ['.metadata-snippet-text', '#description-text', 'yt-formatted-string.metadata-snippet-text'];

export default {
  id: 'youtube',
  label: 'YouTube',
  matches: (loc) => /(^|\.)youtube\.com$/.test(loc.hostname),
  supports: { ratings: false, topics: true },
  hideStyle: 'collapse',
  cardSelector: CARD_SELECTOR,
  context(loc) {
    return contextFromPath(loc.pathname, [
      [/^\/?$/, 'home'],
      [/^\/results/, 'search'],
      [/^\/watch/, 'watch'],
      [/^\/feed\/subscriptions/, 'subscriptions'],
      [/^\/shorts/, 'shorts'],
      [/^\/(@|channel\/|c\/|user\/)/, 'channel'],
    ]);
  },
  extract(card) {
    // Nested wrappers: a rich item wrapping a lockup; only process the outer one.
    if (card.tagName === 'YT-LOCKUP-VIEW-MODEL' && card.closest('ytd-rich-item-renderer, ytd-compact-video-renderer')) return null;
    if (card.tagName === 'YTM-SHORTS-LOCKUP-VIEW-MODEL' && card.closest('ytd-rich-item-renderer')) return null;
    if (card.tagName === 'YTM-SHORTS-LOCKUP-VIEW-MODEL-V2' && card.closest('ytd-rich-item-renderer')) return null;
    let title = '';
    for (const sel of TITLE_SELECTORS) {
      const el = card.querySelector(sel);
      if (!el) continue;
      title = el.getAttribute('title') || text(el) || el.getAttribute('aria-label') || '';
      if (title) break;
    }
    if (!title) return null;
    const channel = firstText(card, CHANNEL_SELECTORS);
    const description = firstText(card, DESCRIPTION_SELECTORS);
    const isShort = /shorts/i.test(card.tagName) || Boolean(card.querySelector('a[href^="/shorts/"]'));
    return { title, channel, description, kind: isShort ? 'short' : 'video' };
  },
};
