// The control panel. Rendered twice from the same code: inside a shadow root
// on the page (the floating toolbar) and in the browser-action popup.
import { PRESETS } from '../lib/topics/presets.js';
import { LOGO_SVG } from './logo.js';
import { topicsActiveOn } from '../lib/settings.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * @param {HTMLElement} root element to render into (emptied first)
 * @param {object} opts
 * @param {object|null} opts.adapter {id,label,supports,hideStyle} or null when not on a supported site
 * @param {object} opts.store settings store (get/save/subscribe)
 * @param {() => {cards:number,hidden:number,dimmed:number}} [opts.getStats]
 * @param {() => Promise<object>} [opts.getEngines]
 * @param {() => void} opts.openOptions
 * @param {boolean} [opts.embedded] popup mode (full width)
 */
export function renderPanel(root, opts) {
  const { store, openOptions, getStats, getEngines, embedded = false } = opts;
  let adapter = opts.adapter;
  let s = store.get();
  let engines = null;

  const el = document.createElement('div');
  el.className = 's-panel' + (embedded ? ' s-embedded' : '');
  root.replaceChildren(el);

  function siteOn() {
    return adapter ? s.sites[adapter.id] !== false : true;
  }

  function presetsMarkup() {
    const all = [...PRESETS, ...(s.customPresets ?? [])];
    return all
      .map((p) => `<button type="button" class="s-chip" data-preset="${esc(p.id)}" aria-pressed="${s.topics.presets.includes(p.id)}">${esc(p.emoji ?? '✦')} ${esc(p.label)}</button>`)
      .join('');
  }

  function enginesMarkup() {
    if (!engines) return `<div class="s-engines"><span class="on"><span class="s-dot"></span>Keyword</span><span><span class="s-dot"></span>checking engines…</span></div>`;
    const e = engines.embedding ?? {};
    const l = engines.llm ?? {};
    const embCls = !e.installed ? '' : e.error ? 'err' : e.ready ? 'on' : e.loading ? 'load' : 'on';
    const embTxt = !s.topics.embedding.enabled ? 'Embeddings off' : !e.installed ? 'Embeddings not installed' : e.error ? `Embeddings: ${e.error}` : e.ready ? 'Embeddings ready' : e.loading ? 'Loading model…' : 'Embeddings (loads on first use)';
    const llmCls = !l.enabled ? '' : l.error ? 'err' : 'on';
    const llmTxt = !l.enabled ? 'LLM off' : l.error ? `LLM: ${l.error}` : `LLM: ${l.label ?? l.provider}`;
    return `<div class="s-engines">
      <span class="on" title="Instant keyword matching, always on"><span class="s-dot"></span>Keyword</span>
      <span class="${embCls}" title="${esc(embTxt)}"><span class="s-dot"></span>${esc(embTxt)}</span>
      <span class="${llmCls}" title="${esc(llmTxt)}"><span class="s-dot"></span>${esc(llmTxt)}</span>
    </div>`;
  }

  function render() {
    s = store.get();
    const r = s.ratings;
    const t = s.topics;
    const key = r.keys[r.provider];
    const showRatings = adapter?.supports?.ratings;
    const stats = getStats?.() ?? null;
    const canCollapse = !adapter || adapter.hideStyle === 'collapse';
    const topicsOn = adapter ? topicsActiveOn(s, adapter.id) || !t.enabled : t.enabled;
    const siteOff = !siteOn();
    el.innerHTML = `
      <div class="s-head">
        <span class="s-logo">${LOGO_SVG}</span>
        <div><div class="s-title">Sieve</div><div class="s-site">${adapter ? esc(adapter.label) : 'Not a supported site'}</div></div>
        <span class="s-spacer"></span>
        ${adapter ? `<input type="checkbox" class="s-switch" data-site-toggle title="Sieve on ${esc(adapter.label)}" ${siteOff ? '' : 'checked'}>` : ''}
      </div>
      <div class="${siteOff ? 's-off' : ''}">
      ${showRatings ? `
      <div class="s-section">
        <div class="s-section-title">★ Ratings <span class="s-spacer"></span><input type="checkbox" class="s-switch" data-set="ratings.enabled" ${r.enabled ? 'checked' : ''}></div>
        <div class="${r.enabled ? '' : 's-off'}">
          ${!key ? `<div class="s-warn">Add a free ${r.provider === 'tmdb' ? 'TMDB' : 'OMDb'} API key in <a href="#" data-options>Settings</a> to see scores.</div>` : ''}
          <div class="s-row"><label>Min IMDb score</label><input type="range" min="0" max="10" step="0.5" value="${r.minImdb}" data-set="ratings.minImdb"><span class="s-val">${r.minImdb > 0 ? r.minImdb.toFixed(1) + '+' : 'off'}</span></div>
          <div class="s-row"><label>Min Rotten Tomatoes</label><input type="range" min="0" max="100" step="5" value="${r.minRt}" data-set="ratings.minRt"><span class="s-val">${r.minRt > 0 ? r.minRt + '%+' : 'off'}</span></div>
          <div class="s-row"><label>Below threshold</label>
            <span class="s-seg" data-seg="ratings.action">
              <button type="button" data-v="dim" aria-pressed="${r.action === 'dim'}">Dim</button>
              <button type="button" data-v="hide" aria-pressed="${r.action === 'hide'}" ${canCollapse ? '' : 'disabled title="Rows on this site break when cards are removed, so Hide behaves like Dim here"'}>Hide</button>
            </span></div>
          <div class="s-row"><label>Show score badges</label><input type="checkbox" class="s-check" data-set="ratings.showBadges" ${r.showBadges ? 'checked' : ''}></div>
          <div class="s-row"><label>Treat unrated as below threshold</label><input type="checkbox" class="s-check" data-set="ratings.hideUnrated" ${r.hideUnrated ? 'checked' : ''}></div>
        </div>
      </div>` : ''}
      <div class="s-section">
        <div class="s-section-title">🎯 Topics${adapter ? ` <span class="s-muted">on ${esc(adapter.label)}</span>` : ''} <span class="s-spacer"></span><input type="checkbox" class="s-switch" data-set="${adapter ? `topics.sites.${adapter.id}` : 'topics.enabled'}" ${topicsOn ? 'checked' : ''}></div>
        ${!t.enabled ? '<div class="s-warn">Paused with Alt+Shift+T. Press it again to resume.</div>' : ''}
        <div class="${topicsOn ? '' : 's-off'}">
          <input type="search" data-query placeholder="What do you want to see? e.g. finance, mutual funds -crypto" value="${esc(t.query)}" autocomplete="off" spellcheck="false">
          <div class="s-chips">${presetsMarkup()}</div>
          <div class="s-row" style="margin-top:10px"><label>Everything else</label>
            <span class="s-seg" data-seg="topics.action">
              <button type="button" data-v="hide" aria-pressed="${t.action === 'hide'}" ${canCollapse ? '' : 'title="Behaves like Dim on this site"'}>Hide</button>
              <button type="button" data-v="dim" aria-pressed="${t.action === 'dim'}">Dim</button>
            </span></div>
          <div class="s-row"><label>Strictness</label><input type="range" min="0" max="100" step="5" value="${t.strictness}" data-set="topics.strictness"><span class="s-val">${t.strictness}</span></div>
          ${enginesMarkup()}
        </div>
      </div>
      </div>
      <div class="s-foot">
        <span data-stats>${stats ? `${stats.cards} cards · ${stats.hidden} hidden${stats.dimmed ? ` · ${stats.dimmed} dimmed` : ''}` : ''}</span>
        <span class="s-spacer"></span>
        ${embedded ? '' : '<span class="s-kbd" title="Toggle this panel">Alt+Shift+S</span>'}
        <button type="button" class="s-btn" data-options>Settings</button>
      </div>`;
    wire();
  }

  function pathSet(path, value) {
    const patch = {};
    let cur = patch;
    const parts = path.split('.');
    parts.forEach((p, i) => {
      cur[p] = i === parts.length - 1 ? value : {};
      cur = cur[p];
    });
    return store.save(patch);
  }

  let queryTimer = null;
  function wire() {
    el.querySelectorAll('[data-options]').forEach((b) =>
      b.addEventListener('click', (e) => {
        e.preventDefault();
        openOptions();
      }),
    );
    el.querySelector('[data-site-toggle]')?.addEventListener('change', (e) => pathSet(`sites.${adapter.id}`, e.target.checked));
    el.querySelectorAll('[data-set]').forEach((input) => {
      const path = input.dataset.set;
      const handler = () => {
        const v = input.type === 'checkbox' ? input.checked : input.type === 'range' ? Number(input.value) : input.value;
        pathSet(path, v);
      };
      input.addEventListener(input.type === 'range' ? 'change' : 'change', handler);
      if (input.type === 'range') {
        input.addEventListener('input', () => {
          const val = input.closest('.s-row')?.querySelector('.s-val');
          if (!val) return;
          const n = Number(input.value);
          val.textContent = path === 'ratings.minImdb' ? (n > 0 ? n.toFixed(1) + '+' : 'off') : path === 'ratings.minRt' ? (n > 0 ? n + '%+' : 'off') : String(n);
        });
      }
    });
    el.querySelectorAll('[data-seg]').forEach((seg) => {
      seg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => pathSet(seg.dataset.seg, b.dataset.v)));
    });
    el.querySelectorAll('[data-preset]').forEach((chip) =>
      chip.addEventListener('click', () => {
        const id = chip.dataset.preset;
        const cur = store.get().topics.presets;
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
        store.save({ topics: { presets: next, enabled: true, ...(adapter ? { sites: { [adapter.id]: true } } : {}) } });
      }),
    );
    const q = el.querySelector('[data-query]');
    q?.addEventListener('input', () => {
      clearTimeout(queryTimer);
      queryTimer = setTimeout(() => store.save({ topics: { query: q.value, enabled: true, ...(adapter ? { sites: { [adapter.id]: true } } : {}) } }), 350);
    });
    q?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(queryTimer);
        store.save({ topics: { query: q.value, enabled: true, ...(adapter ? { sites: { [adapter.id]: true } } : {}) } });
      }
      e.stopPropagation(); // keep the host page's shortcuts (YouTube's "/" etc.) out of our input
    });
  }

  function refreshStats() {
    const stats = getStats?.();
    const span = el.querySelector('[data-stats]');
    if (span && stats) span.textContent = `${stats.cards} cards · ${stats.hidden} hidden${stats.dimmed ? ` · ${stats.dimmed} dimmed` : ''}`;
  }

  async function refreshEngines() {
    if (!getEngines) return;
    try {
      engines = await getEngines();
    } catch {
      engines = null;
    }
    const slot = el.querySelector('.s-engines');
    if (slot) slot.outerHTML = enginesMarkup();
  }

  const unsub = store.subscribe(() => {
    // Keep focus and caret if the user is typing in the query box.
    const active = el.querySelector('[data-query]');
    const typing = active && el.getRootNode().activeElement === active;
    if (typing) {
      s = store.get();
      el.querySelectorAll('[data-preset]').forEach((c) => c.setAttribute('aria-pressed', String(s.topics.presets.includes(c.dataset.preset))));
      refreshStats();
      return;
    }
    render();
    refreshEngines();
  });

  render();
  refreshEngines();
  return {
    el,
    refreshStats,
    refreshEngines,
    setAdapter(a) {
      adapter = a;
      render();
    },
    destroy() {
      unsub();
      el.remove();
    },
  };
}
