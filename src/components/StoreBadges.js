import React, { useEffect, useState } from 'react';
import { APP_STORE_LIVE, APP_STORE_RELEASE, APP_STORE_SOON, APP_STORE_URL, PLAY_STORE_URL } from '../stores';
import { prefersReducedMotion } from './hooks';

// "2d 21h 14m 05s"; the days drop off on the last day. `seconds: false`
// gives "2d 21h 14m".
export function formatCountdown(ms, { seconds = true } = {}) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  const days = Math.floor(total / 86400);
  const parts = [`${pad(Math.floor((total % 86400) / 3600))}h`, `${pad(Math.floor((total % 3600) / 60))}m`];
  if (seconds) parts.push(`${pad(total % 60)}s`);
  const rest = parts.join(' ');
  return days ? `${days}d ${rest}` : rest;
}

// Only in the browser: the prerendered HTML can't know what time it is, so
// the line stays empty (but keeps its height) until the page runs. With
// reduced motion on, it ticks once a minute instead of every second: a
// ticking number is auto-updating content (WCAG 2.2.2).
function Countdown() {
  const [left, setLeft] = useState(null);
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const still = prefersReducedMotion();
    setCalm(still);
    const tick = () => setLeft(APP_STORE_RELEASE - Date.now());
    tick();
    const timer = setInterval(tick, still ? 60000 : 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="store__sub" role="timer">
      {left > 0 ? formatCountdown(left, { seconds: !calm }) : ''}
    </span>
  );
}

const AppStoreBadge = () => (
  <img src="/badges/app-store.svg" alt="Download on the App Store" width="120" height="40" />
);

// The official badges, as Apple and Google supply them (Apple's marketing
// toolbox, Google's badge generator): never redrawn or recoloured. Store
// links and APP_STORE_LIVE: src/stores.js. On laptops, a QR code for
// dayzi.live/download sits next to them, for the phone in your pocket.
//
// Until the App Store is live, each badge has its own caption, starting at
// the same height: "Free · 18+" and "Coming 10 Nov / <countdown>". After,
// both badges are links and one "Free · 18+" line sits under the pair.
export default function StoreBadges() {
  const play = (
    <a className="store-badge store-badge--play" href={PLAY_STORE_URL}>
      <img src="/badges/google-play.png" alt="Get it on Google Play" width="646" height="250" />
    </a>
  );
  return (
    <div className="stores">
      <div className="stores__main">
        {APP_STORE_LIVE ? (
          <>
            <div className="stores__badges">
              {play}
              <a className="store-badge" href={APP_STORE_URL}>
                <AppStoreBadge />
              </a>
            </div>
            <p className="stores__note">Free · 18+</p>
          </>
        ) : (
          <div className="stores__badges">
            <div className="store">
              {play}
              <p className="store__note">Free · 18+</p>
            </div>
            {/* Not a link yet: the App Store page 404s until launch day. */}
            <div className="store">
              <span className="store-badge">
                <AppStoreBadge />
              </span>
              <p className="store__note">
                {APP_STORE_SOON} <Countdown />
              </p>
            </div>
          </div>
        )}
      </div>
      <figure className="stores__qr">
        <img src="/qr/dayzi-download.svg" alt="QR code for dayzi.live/download" width="112" height="112" />
        <figcaption>Scan with your phone</figcaption>
      </figure>
    </div>
  );
}
