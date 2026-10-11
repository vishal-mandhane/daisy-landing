// Entry point on a supported page: pick the adapter, load settings, start the
// scanner and the two lenses, mount the toolbar, answer the popup.
import { api, storageArea } from '../lib/browser.js';
import { createSettingsStore } from '../lib/settings.js';
import { pickAdapter } from '../sites/index.js';
import { Scanner } from './scanner.js';
import { RatingsLens } from './lens-ratings.js';
import { TopicLens } from './lens-topics.js';
import { clearAll } from './apply.js';
import { mountToolbar } from './toolbar.js';

const adapter = pickAdapter(location, document);
if (adapter) boot(adapter).catch((err) => console.warn('[sieve] boot failed', err));

async function boot(adapter) {
  const store = createSettingsStore(storageArea('sync'), {
    onChange: (cb) => api.storage.onChanged.addListener((changes, area) => area === 'sync' && cb(changes)),
  });
  let settings = await store.load();
  const getSettings = () => settings;

  const send = async (msg) => {
    const res = await api.runtime.sendMessage(msg);
    if (res && typeof res === 'object' && res.__error) throw new Error(res.__error);
    return res;
  };

  // Stats are derived from the DOM so the panel never drifts from reality.
  let statsTimer = null;
  const getStats = () => {
    let cards = 0;
    let hidden = 0;
    let dimmed = 0;
    for (const c of scanner.cards) {
      if (!c.el.isConnected) continue;
      cards++;
      if (c.el.dataset.sieve === 'hide') hidden++;
      else if (c.el.dataset.sieve === 'dim') dimmed++;
    }
    return { cards, hidden, dimmed };
  };
  const scheduleStats = () => {
    if (statsTimer) return;
    statsTimer = setTimeout(() => {
      statsTimer = null;
      toolbar?.refresh();
    }, 250);
  };

  const siteEnabled = () => settings.sites[adapter.id] !== false;
  const ratings = new RatingsLens({ adapter, send, getSettings, onStats: scheduleStats });
  const topics = new TopicLens({ adapter, send, getSettings, onStats: scheduleStats });
  topics.rebuild();

  const scanner = new Scanner(adapter, (card) => {
    if (!siteEnabled()) return;
    ratings.process(card);
    topics.process(card);
    scheduleStats();
  });
  scanner.start();

  const openOptions = () => send({ type: 'options.open' });
  let toolbar = null;
  const mountIfWanted = () => {
    if (settings.ui.toolbar && !toolbar) toolbar = mountToolbar({ adapter, store, getStats, getEngines: () => send({ type: 'engines.status' }), openOptions });
    else if (!settings.ui.toolbar && toolbar) {
      toolbar.unmount();
      toolbar = null;
    }
  };
  mountIfWanted();

  store.subscribe((next) => {
    const prev = settings;
    settings = next;
    mountIfWanted();
    if (!siteEnabled()) {
      clearAll(document);
      scheduleStats();
      return;
    }
    const cards = [...scanner.cards].filter((c) => c.el.isConnected);
    if (prev.sites[adapter.id] === false) {
      scanner.reset();
      return;
    }
    if (JSON.stringify([prev.topics, prev.customPresets]) !== JSON.stringify([next.topics, next.customPresets])) {
      topics.rebuild();
      topics.refreshEngines().then(() => cards.forEach((c) => topics.process(c)));
    }
    if (JSON.stringify(prev.ratings) !== JSON.stringify(next.ratings)) ratings.rerender(cards);
    scheduleStats();
  });

  api.runtime.onMessage.addListener((msg, _sender, respond) => {
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'site.info') {
      respond({ adapter: { id: adapter.id, label: adapter.label, supports: adapter.supports, hideStyle: adapter.hideStyle }, stats: getStats(), context: scanner.context });
      return true;
    }
    if (msg.type === 'panel.toggle') {
      toolbar?.toggle();
      respond({ ok: Boolean(toolbar) });
      return true;
    }
    if (msg.type === 'engines.changed') {
      topics.refreshEngines().then(() => [...scanner.cards].forEach((c) => topics.process(c)));
      respond({ ok: true });
      return true;
    }
  });
}
