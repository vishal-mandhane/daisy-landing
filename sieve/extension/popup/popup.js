import { api, storageArea } from '../lib/browser.js';
import { createSettingsStore } from '../lib/settings.js';
import { renderPanel } from '../ui/panel.js';

const store = createSettingsStore(storageArea('sync'), {
  onChange: (cb) => api.storage.onChanged.addListener((changes, area) => area === 'sync' && cb(changes)),
});

async function main() {
  await store.load();
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  let info = null;
  if (tab?.id) {
    try {
      info = await api.tabs.sendMessage(tab.id, { type: 'site.info' });
    } catch {
      info = null;
    }
  }
  let stats = info?.stats ?? null;
  const panel = renderPanel(document.getElementById('root'), {
    adapter: info?.adapter ?? null,
    store,
    embedded: true,
    getStats: () => stats,
    getEngines: () => api.runtime.sendMessage({ type: 'engines.status' }),
    openOptions: () => {
      api.runtime.openOptionsPage();
      window.close();
    },
  });
  if (tab?.id && info) {
    setInterval(async () => {
      try {
        const fresh = await api.tabs.sendMessage(tab.id, { type: 'site.info' });
        stats = fresh?.stats ?? stats;
        panel.refreshStats();
      } catch {
        /* tab navigated away */
      }
    }, 1000);
  }
}
main();
