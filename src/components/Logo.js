import React from 'react';
import Daisy from './Daisy';

// The app icon: a daisy on a black tile.
export default function Logo({ size = 30 }) {
  return (
    <span className="logo-tile" style={{ width: size, height: size }} aria-hidden="true">
      <Daisy size={Math.round(size * 0.74)} petal="#FFFFFF" center="#F5C518" />
    </span>
  );
}
