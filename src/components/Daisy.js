import React from 'react';

// The Dayzi mark: a daisy. `spin` slowly rotates the petals.
export default function Daisy({ size = 32, spin = false, petal = 'currentColor', center = '#FFC93C', className = '' }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      className={`daisy${spin ? ' daisy--spin' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <g className="daisy__petals">
        {petals.map((deg) => (
          <ellipse key={deg} cx="50" cy="22" rx="9" ry="21" fill={petal} transform={`rotate(${deg} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="15" fill={center} />
    </svg>
  );
}
