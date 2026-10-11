// Floating pill + panel, isolated in a shadow root so site CSS cannot touch it.
import { runtimeUrl } from '../lib/browser.js';
import { renderPanel } from '../ui/panel.js';
import { LOGO_SVG } from '../ui/logo.js';
import { topicsActiveOn } from '../lib/settings.js';

export function mountToolbar({ adapter, store, getStats, getEngines, openOptions }) {
  const host = document.createElement('div');
  host.id = 'sieve-root';
  host.style.cssText = 'all:initial; position:fixed; z-index:2147483646; bottom:18px; right:18px; font-size:13px;';
  const shadow = host.attachShadow({ mode: 'open' });
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = runtimeUrl('ui/panel.css');
  const style = document.createElement('style');
  style.textContent = `
    .pill { display:flex; align-items:center; gap:8px; padding:7px 12px 7px 8px; border-radius:999px; cursor:pointer; user-select:none;
      background: var(--s-bg); color: var(--s-fg); border:1px solid var(--s-line); box-shadow: var(--s-shadow); font: 600 12.5px/1 var(--s-font); }
    .pill:hover { border-color: var(--s-accent); }
    .pill .s-logo { width:18px; height:18px; display:inline-flex; }
    .pill .summary { color: var(--s-muted); font-weight:500; max-width: 220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .pill .summary b { color: var(--s-fg); font-weight:600; }
    .wrap { position:absolute; bottom:44px; right:0; display:none; }
    .wrap.open { display:block; }
    .left .wrap { right:auto; left:0; }
  `;
  const pill = document.createElement('div');
  pill.className = 'pill';
  pill.setAttribute('role', 'button');
  pill.setAttribute('aria-label', 'Open Sieve');
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  shadow.append(link, style, wrap, pill);
  (document.body ?? document.documentElement).appendChild(host);

  let panel = null;
  function summary() {
    const s = store.get();
    const stats = getStats?.();
    const bits = [];
    if (s.sites[adapter.id] === false) bits.push('off');
    else {
      if (adapter.supports.ratings && s.ratings.enabled && (s.ratings.minImdb > 0 || s.ratings.minRt > 0)) bits.push(`<b>★ ${s.ratings.minImdb > 0 ? s.ratings.minImdb + '+' : s.ratings.minRt + '%+'}</b>`);
      if (topicsActiveOn(s, adapter.id) && (s.topics.query.trim() || s.topics.presets.length)) {
        const label = [...s.topics.presets, ...(s.topics.query.trim() ? [s.topics.query.trim()] : [])].join(', ');
        bits.push(`<b>🎯 ${label.replace(/[&<>]/g, '')}</b>`);
      }
      if (stats && (stats.hidden || stats.dimmed)) bits.push(`${stats.hidden + stats.dimmed} filtered`);
    }
    return bits.length ? bits.join(' · ') : 'tap to filter';
  }
  function paint() {
    pill.innerHTML = `<span class="s-logo">${LOGO_SVG}</span><span>Sieve</span><span class="summary">${summary()}</span>`;
    host.classList.toggle('left', store.get().ui.position === 'bottom-left');
    if (store.get().ui.position === 'bottom-left') {
      host.style.right = 'auto';
      host.style.left = '18px';
    } else {
      host.style.left = 'auto';
      host.style.right = '18px';
    }
  }
  function open() {
    if (!panel) panel = renderPanel(wrap, { adapter, store, getStats, getEngines, openOptions });
    wrap.classList.add('open');
    panel.refreshStats();
    panel.refreshEngines();
    wrap.querySelector('[data-query]')?.focus({ preventScroll: true });
  }
  function close() {
    wrap.classList.remove('open');
  }
  const isOpen = () => wrap.classList.contains('open');
  pill.addEventListener('click', () => (isOpen() ? close() : open()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });
  document.addEventListener('pointerdown', (e) => {
    if (isOpen() && !e.composedPath().includes(host)) close();
  });
  store.subscribe(paint);
  paint();
  return {
    toggle: () => (isOpen() ? close() : open()),
    open,
    close,
    refresh() {
      paint();
      panel?.refreshStats();
    },
    unmount() {
      panel?.destroy();
      host.remove();
    },
  };
}
