import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './hooks';

// A muted, looping clip from /public/app that only plays while on screen.
export default function Clip({ name, className = '', label }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`clip ${className}`}
      src={`/app/${name}.mp4`}
      poster={`/app/${name}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : 'true'}
    />
  );
}
