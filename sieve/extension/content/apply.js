// Applies a lens decision to a card element and keeps the two lenses from
// fighting: a card is hidden if either lens says so.

const states = new WeakMap(); // el -> { ratings: 'show'|'hide'|'dim', topics: ... }

function combined(s) {
  const vals = Object.values(s);
  if (vals.includes('hide')) return 'hide';
  if (vals.includes('dim')) return 'dim';
  return 'show';
}

/**
 * @param {Element} el
 * @param {'ratings'|'topics'} lens
 * @param {'show'|'hide'|'dim'|null} verdict null clears the lens' opinion
 * @param {'collapse'|'dim'} hideStyle site constraint
 */
export function applyState(el, lens, verdict, hideStyle = 'collapse') {
  let s = states.get(el);
  if (!s) states.set(el, (s = {}));
  if (verdict == null) delete s[lens];
  else s[lens] = verdict;
  let final = combined(s);
  if (final === 'hide' && hideStyle === 'dim') final = 'dim';
  if (final === 'show') delete el.dataset.sieve;
  else el.dataset.sieve = final;
  return final;
}

export function clearAll(root = document) {
  for (const el of root.querySelectorAll('[data-sieve]')) delete el.dataset.sieve;
  for (const b of root.querySelectorAll('.sieve-badge')) b.remove();
  for (const h of root.querySelectorAll('.sieve-badge-host')) h.classList.remove('sieve-badge-host');
}

export function setBadge(card, host, textContent, tone, title = '') {
  let badge = host.querySelector(':scope > .sieve-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'sieve-badge';
    host.classList.add('sieve-badge-host');
    host.appendChild(badge);
  }
  badge.textContent = textContent;
  badge.dataset.tone = tone;
  if (title) badge.title = title;
  return badge;
}

export function removeBadge(host) {
  host.querySelector(':scope > .sieve-badge')?.remove();
}
