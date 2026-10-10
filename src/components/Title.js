import React from 'react';

// Renders ['Pick five ', 'vibes', '.'] as: Pick five <em>vibes</em>.
export default function Title({ parts, as: Tag = 'h3', className = '' }) {
  const [before, accent, after] = parts;
  return (
    <Tag className={className}>
      {before}
      <em>{accent}</em>
      {after}
    </Tag>
  );
}
