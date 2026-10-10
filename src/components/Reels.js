import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Instagram } from 'lucide-react';
import { REELS, SOCIAL } from '../data';

function ReelCard({ reel, index }) {
  const tilt = ['-2deg', '1.5deg', '-1deg', '2deg'][index % 4];

  if (reel.video) {
    return (
      <a className="reel reel--native" style={{ '--tilt': tilt }} href={reel.url} target="_blank" rel="noopener noreferrer">
        <video className="reel__video" src={reel.video} poster={reel.poster} muted loop playsInline autoPlay />
        <span className="reel__shade" />
        <span className="reel__caption">{reel.caption}</span>
        <span className="reel__badge">
          <Instagram size={14} /> Watch
        </span>
      </a>
    );
  }

  // Official Instagram embed markup. embed.js swaps the blockquote for the
  // player; until then (or if Instagram can't load) the styled link inside it
  // shows instead. Set as raw HTML so React never fights embed.js over it.
  const permalink = `${reel.url.split('?')[0]}?utm_source=ig_embed&utm_campaign=loading`;
  const poster = reel.poster ? `<img class="reel__fallback-img" src="${reel.poster}" alt="" />` : '';
  const html = `
    <blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14">
      <a class="reel__fallback" href="${permalink}" target="_blank" rel="noopener noreferrer">
        ${poster}
        <span class="reel__fallback-num">#${String(index + 1).padStart(2, '0')}</span>
        <span class="reel__fallback-play" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
        <span class="reel__fallback-text">
          <strong>${reel.caption}</strong>
          <span>Watch on Instagram</span>
        </span>
      </a>
    </blockquote>`;

  return <div className="reel reel--embed" style={{ '--tilt': tilt }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Reels() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // Load Instagram's embed script only when the section is close to view.
  useEffect(() => {
    const needsEmbed = REELS.some((r) => !r.video);
    if (!needsEmbed || !sectionRef.current) return;

    const process = () => window.instgrm && window.instgrm.Embeds.process();
    const load = () => {
      if (window.instgrm) {
        process();
        return;
      }
      if (document.getElementById('instagram-embed-js')) return;
      const script = document.createElement('script');
      script.id = 'instagram-embed-js';
      script.async = true;
      script.src = 'https://www.instagram.com/embed.js';
      script.onload = process;
      document.body.appendChild(script);
    };

    if (typeof IntersectionObserver === 'undefined') {
      load();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: '600px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.reel');
    const amount = card ? card.offsetWidth + 24 : 360;
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="night" id="reels" ref={sectionRef} aria-labelledby="reels-title">
      <div className="wrap night__head reveal">
        <div>
          <p className="label label--sun">After hours</p>
          <h2 id="reels-title" className="display display--night">
            Previously,
            <br />
            <em>on Dayzi.</em>
          </h2>
        </div>
        <div className="night__actions">
          <a className="chip-link" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram size={16} /> {SOCIAL.instagramHandle}
          </a>
          <button type="button" className="round-btn" onClick={() => scroll('left')} aria-label="Scroll reels left">
            <ArrowLeft size={18} />
          </button>
          <button type="button" className="round-btn" onClick={() => scroll('right')} aria-label="Scroll reels right">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="reels" ref={trackRef}>
        {REELS.map((reel, i) => (
          <ReelCard key={reel.url} reel={reel} index={i} />
        ))}
        <a className="reel reel--more" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
          <span className="reel--more__ring">
            <Instagram size={30} />
          </span>
          <strong>More nights on the gram</strong>
          <span>{SOCIAL.instagramHandle}</span>
        </a>
      </div>
    </section>
  );
}
