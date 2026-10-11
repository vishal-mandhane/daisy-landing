// Finds cards on the page and keeps finding them as the site lazy-loads rows
// or navigates in place. Emits each card once, re-emits all on `reset()`.
import { parseTitle } from '../lib/titles.js';

export class Scanner {
  /**
   * @param {object} adapter site adapter
   * @param {(card: Card) => void} onCard
   */
  constructor(adapter, onCard, { root = document, win = window } = {}) {
    this.adapter = adapter;
    this.onCard = onCard;
    this.root = root;
    this.win = win;
    this.seen = new WeakSet();
    this.cards = new Set();
    this.scheduled = false;
    this.lastUrl = win.location.href;
    this.context = adapter.context(win.location);
  }

  start() {
    this.observer = new this.win.MutationObserver(() => this.schedule());
    this.observer.observe(this.root.documentElement ?? this.root, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label', 'title', 'alt', 'href'] });
    // SPA navigations: YouTube fires an event; the others just change the URL.
    this.win.addEventListener('yt-navigate-finish', () => this.onNavigate(), true);
    this.urlTimer = this.win.setInterval(() => {
      if (this.win.location.href !== this.lastUrl) this.onNavigate();
    }, 500);
    this.scan();
  }

  stop() {
    this.observer?.disconnect();
    this.win.clearInterval(this.urlTimer);
  }

  onNavigate() {
    this.lastUrl = this.win.location.href;
    this.context = this.adapter.context(this.win.location);
    this.schedule();
  }

  schedule() {
    if (this.scheduled) return;
    this.scheduled = true;
    const run = () => {
      this.scheduled = false;
      this.scan();
    };
    (this.win.requestIdleCallback ?? ((fn) => this.win.setTimeout(fn, 60)))(run, { timeout: 400 });
  }

  scan() {
    const nodes = this.root.querySelectorAll(this.adapter.cardSelector);
    for (const el of nodes) {
      if (this.seen.has(el)) {
        // Sites recycle elements for new content; detect a changed title.
        const prev = el.__sieveTitle;
        const info = this.adapter.extract(el);
        if (info && info.title !== prev) this.emit(el, info);
        continue;
      }
      this.seen.add(el);
      const info = this.adapter.extract(el);
      if (!info) continue;
      this.emit(el, info);
    }
    for (const c of this.cards) if (!c.el.isConnected) this.cards.delete(c);
  }

  emit(el, info) {
    el.__sieveTitle = info.title;
    const parsed = parseTitle(info.title);
    const card = {
      el,
      raw: info.title,
      title: parsed.title,
      year: parsed.year,
      kind: info.kind ?? parsed.kind,
      channel: info.channel ?? '',
      description: info.description ?? '',
      context: this.context,
    };
    el.__sieveCard = card;
    el.dataset.sieveTitle = card.title; // visible to devtools and to bug reports
    this.cards.add(card);
    this.onCard(card);
  }

  /** Forget decisions and re-emit every card (settings changed). */
  reset() {
    this.seen = new WeakSet();
    for (const c of this.cards) delete c.el.__sieveTitle;
    this.cards.clear();
    this.scan();
  }
}
