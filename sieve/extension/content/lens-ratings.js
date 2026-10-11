// Ratings lens: ask the background for a rating per card, show a badge and
// dim/hide cards under the user's thresholds.
import { judgeRating, formatRating } from '../lib/ratings/index.js';
import { applyState, setBadge, removeBadge } from './apply.js';

export class RatingsLens {
  constructor({ adapter, send, getSettings, onStats }) {
    this.adapter = adapter;
    this.send = send;
    this.getSettings = getSettings;
    this.onStats = onStats;
    this.ratings = new WeakMap(); // el -> rating | undefined (pending)
    this.counts = { total: 0, hidden: 0, unrated: 0 };
  }

  enabled() {
    const s = this.getSettings();
    return Boolean(s.ratings.enabled && this.adapter.supports.ratings);
  }

  async process(card) {
    if (!this.enabled()) return this.clear(card);
    const s = this.getSettings();
    if (!s.ratings.keys[s.ratings.provider]) {
      this.render(card, undefined, 'no-key');
      return;
    }
    this.render(card, undefined);
    let rating;
    try {
      rating = await this.send({ type: 'rating.get', q: { title: card.title, year: card.year, kind: card.kind } });
    } catch {
      rating = null;
    }
    if (card.el.__sieveCard !== card) return; // card was recycled meanwhile
    this.ratings.set(card.el, rating ?? null);
    this.render(card, rating ?? null);
  }

  host(card) {
    return this.adapter.badgeHost?.(card.el) ?? card.el;
  }

  render(card, rating, note) {
    const s = this.getSettings();
    const verdict = judgeRating(rating, s.ratings);
    const host = this.host(card);
    if (s.ratings.showBadges) {
      if (note === 'no-key') setBadge(card, host, '★ key?', 'na', 'Sieve: add an OMDb or TMDB key in Settings to see ratings');
      else if (verdict === 'pending') setBadge(card, host, '★ …', 'pending');
      else if (rating?.error) setBadge(card, host, '★ ?', 'na', `Sieve: rating lookup failed (${rating.error}). Check the key in Settings; retried in 10 minutes.`);
      else {
        const label = formatRating(rating);
        setBadge(card, host, label, verdict === 'fail' ? 'bad' : verdict === 'pass' && (s.ratings.minImdb || s.ratings.minRt) ? 'good' : rating?.unrated ? 'na' : 'good', rating?.title ? `${rating.title}${rating.year ? ` (${rating.year})` : ''}` : '');
      }
    } else removeBadge(host);
    const action = verdict === 'fail' ? s.ratings.action : 'show';
    applyState(card.el, 'ratings', action, this.adapter.hideStyle);
    this.onStats?.();
  }

  /** Re-render from cached ratings after a threshold change — no network. */
  rerender(cards) {
    for (const card of cards) {
      if (!this.enabled()) {
        this.clear(card);
        continue;
      }
      const r = this.ratings.get(card.el);
      if (r === undefined) this.process(card);
      else this.render(card, r);
    }
  }

  clear(card) {
    removeBadge(this.host(card));
    applyState(card.el, 'ratings', null, this.adapter.hideStyle);
  }
}
