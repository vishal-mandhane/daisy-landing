import React, { useEffect, useState } from 'react';
import { APP_STORE_LIVE, APP_STORE_RELEASE, APP_STORE_SOON, APP_STORE_URL, PLAY_STORE_URL } from '../stores';

// "2d 21h 14m 05s"; the days drop off on the last day.
export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  const days = Math.floor(total / 86400);
  const rest = `${pad(Math.floor((total % 86400) / 3600))}h ${pad(Math.floor((total % 3600) / 60))}m ${pad(total % 60)}s`;
  return days ? `${days}d ${rest}` : rest;
}

// Only in the browser: the prerendered HTML can't know what time it is, so
// it carries the date alone and the countdown appears once the page runs.
function Countdown() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(APP_STORE_RELEASE - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  if (left === null || left <= 0) return null;
  return (
    <span className="store-soon__count" role="timer">
      {formatCountdown(left)}
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
export default function StoreBadges() {
  return (
    <div className="stores">
      <div className="stores__main">
        <div className="stores__badges">
          <a className="store-badge store-badge--play" href={PLAY_STORE_URL}>
            <img src="/badges/google-play.png" alt="Get it on Google Play" width="646" height="250" />
          </a>
          {APP_STORE_LIVE ? (
            <a className="store-badge" href={APP_STORE_URL}>
              <AppStoreBadge />
            </a>
          ) : (
            // Not a link yet: the App Store page 404s until launch day.
            <div className="store-soon">
              <span className="store-badge">
                <AppStoreBadge />
              </span>
              <p className="store-soon__note">
                {APP_STORE_SOON} <Countdown />
              </p>
            </div>
          )}
        </div>
        <p className="stores__note">Free · 18+</p>
      </div>
      <figure className="stores__qr">
        <img src="/qr/dayzi-download.svg" alt="QR code for dayzi.live/download" width="112" height="112" />
        <figcaption>Scan with your phone</figcaption>
      </figure>
    </div>
  );
}
