import React from 'react';

// The app icon (the daisy with its stem, on a dark tile), straight from the app.
export default function Logo({ size = 30 }) {
  return (
    <span className="logo-tile" style={{ width: size, height: size }} aria-hidden="true">
      <img src="/logo192.png" alt="" width={size} height={size} />
    </span>
  );
}
