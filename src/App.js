import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Instagram, Youtube, Play } from 'lucide-react';
import './App.css';

// ============================================================
// EMAILOCTOPUS - reCAPTCHA disabled, direct API should work now!
// ============================================================
const FORM_ACTION = 'https://eomail5.com/form/b7b93d50-eaf6-11f0-abdc-bf3561320fe8';

const INSTAGRAM_URL = 'https://www.instagram.com/dayzi_india/';

// ============================================================
// INSTAGRAM REELS
// - `url` is the reel link from Instagram (Share -> Copy link).
// - Optional `video`: a downloaded copy of the reel saved in /public/reels
//   (e.g. '/reels/night-1.mp4'). When set, the reel plays inline, muted and
//   looping, with no Instagram chrome. Without it, the official Instagram
//   embed is used, and a styled "watch on Instagram" card shows if the
//   embed can't load.
// - Optional `poster`: a still image for the card (e.g. '/reels/night-1.jpg').
// ============================================================
const REELS = [
  { url: 'https://www.instagram.com/reel/DTsjgDxiFUV/', caption: 'Dayzi vibes' },
  { url: 'https://www.instagram.com/reel/DTiLjz8CEPb/', caption: 'The night was electric' },
  { url: 'https://www.instagram.com/reel/DVBhZTriKUd/', caption: 'Energy was unmatched' },
  { url: 'https://www.instagram.com/reel/DX9cea6oyqw/', caption: 'You had to be there' },
];

const MARQUEE_WORDS = ['The best plans', 'The right people', 'The perfect timing', 'All in one place'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Muted looping video that only plays while on screen (replaces the old GIFs).
function LoopVideo({ name, className, eager = false }) {
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
      { threshold: 0.15 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={`/media/${name}.jpg`}
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'metadata'}
      aria-hidden="true"
    >
      <source src={`/media/${name}.webm`} type="video/webm" />
      <source src={`/media/${name}.mp4`} type="video/mp4" />
    </video>
  );
}

// Adds `is-visible` to `.reveal` elements as they scroll into view.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function SignupForm({ cta, note, successMessage, centered = false }) {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (!city || !city.trim()) {
      alert('Please enter your city');
      return;
    }

    setLoading(true);

    try {
      // EmailOctopus form submission (reCAPTCHA disabled)
      // Form field IDs (from the form's HTML): field_0 = Email, field_3 = City
      const formData = new FormData();
      formData.append('field_0', email);
      formData.append('field_3', city.trim());
      formData.append('hpc4b27b6e-eb3b-11e9-be00-06b4694bee2a', '');

      const response = await fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setEmail('');
        setCity('');
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        throw new Error(result.error?.message || 'Submission failed');
      }
    } catch (error) {
      console.error('EmailOctopus error:', error);
      alert('Something went wrong. Please try again. (' + (error.message || 'unknown') + ')');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`signup${centered ? ' signup--centered' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="signup__fields">
        <input
          type="email"
          placeholder="Your email"
          aria-label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Your city"
          aria-label="City"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Sending...' : cta} {!loading && <ArrowRight size={18} />}
        </button>
      </div>
      <p className="signup__note">{note}</p>
      {submitted && (
        <p className="signup__success" role="status">
          <CheckCircle size={16} /> {successMessage}
        </p>
      )}
    </form>
  );
}

function ReelCard({ reel }) {
  if (reel.video) {
    return (
      <a className="reel reel--native" href={reel.url} target="_blank" rel="noopener noreferrer">
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
  // shows instead. It's set as raw HTML so React never fights embed.js over it.
  const permalink = `${reel.url.split('?')[0]}?utm_source=ig_embed&utm_campaign=loading`;
  const poster = reel.poster ? `<img class="reel__fallback-img" src="${reel.poster}" alt="" />` : '';
  const html = `
    <blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14">
      <a class="reel__fallback" href="${permalink}" target="_blank" rel="noopener noreferrer">
        ${poster}
        <span class="reel__fallback-play" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
        <span class="reel__fallback-text">
          <strong>${reel.caption}</strong>
          <span>Watch on Instagram</span>
        </span>
      </a>
    </blockquote>`;

  return <div className="reel reel--embed" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ReelsSection() {
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
    const amount = card ? card.offsetWidth + 20 : 360;
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="section reels" ref={sectionRef} aria-labelledby="reels-title">
      <div className="container reels__head reveal">
        <div>
          <span className="eyebrow">From the gram</span>
          <h2 id="reels-title" className="h2">
            See the <em className="accent">vibe</em>
          </h2>
        </div>
        <div className="reels__actions">
          <a className="pill-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Instagram size={16} /> @dayzi_india
          </a>
          <button type="button" className="icon-btn" onClick={() => scroll('left')} aria-label="Scroll reels left">
            <ArrowLeft size={18} />
          </button>
          <button type="button" className="icon-btn" onClick={() => scroll('right')} aria-label="Scroll reels right">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="reels__track" ref={trackRef}>
        {REELS.map((reel) => (
          <ReelCard key={reel.url} reel={reel} />
        ))}
        <a className="reel reel--more" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <span className="reel--more__ring">
            <Play size={28} />
          </span>
          <strong>More on Instagram</strong>
          <span>@dayzi_india</span>
        </a>
      </div>
    </section>
  );
}

export default function DaisyLanding() {
  useReveal();

  return (
    <div className="page">
      <div className="bg-glow" aria-hidden="true">
        <span className="bg-glow__a" />
        <span className="bg-glow__b" />
      </div>
      <div className="grain" aria-hidden="true" />

      {/* NAV */}
      <header className="nav">
        <a href="/" className="nav__logo" aria-label="Dayzi home">
          dayzi<span className="nav__dot">.</span>
        </a>
        <a href="#join" className="btn btn--ghost btn--sm">
          Get early access
        </a>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content reveal">
              <span className="chip">
                <span className="chip__pulse" /> Rolling invites
              </span>
              <h1 className="hero__title">
                Stop missing out.
                <br />
                <em className="accent">Start showing up.</em>
              </h1>
              <p className="hero__subtitle">
                The best plans. The right people. The perfect timing. All in one place.
              </p>
              <SignupForm cta="Get Early Access" note="No spam. Just access." successMessage="You're on the list." />
            </div>

            <div className="hero__media reveal reveal--delay">
              <div className="frame frame--tilt">
                <LoopVideo name="hero" className="frame__video" eager />
              </div>
              <span className="sticker sticker--top">tonight?</span>
              <span className="sticker sticker--bottom">✦ you in</span>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1].map((n) => (
              <div className="marquee__group" key={n}>
                {MARQUEE_WORDS.map((word) => (
                  <span key={word} className="marquee__item">
                    {word} <span className="marquee__star">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* THIS ISN'T FOR EVERYONE */}
        <section className="section">
          <div className="container container--narrow center reveal">
            <h2 className="h2">This isn't for everyone</h2>
            <blockquote className="quote-card">
              If going out, meeting new people, and trying new places isn't your thing.
            </blockquote>
            <p className="kicker">Then this probably isn't it.</p>
          </div>
        </section>

        {/* THE VIBE SECTION */}
        <section className="section">
          <div className="container vibe">
            <figure className="vibe__item reveal">
              <div className="frame frame--left">
                <LoopVideo name="vibe1" className="frame__video" />
              </div>
              <figcaption>You hear about this the next day.</figcaption>
            </figure>
            <span className="vibe__or reveal" aria-hidden="true">
              or
            </span>
            <figure className="vibe__item vibe__item--offset reveal reveal--delay">
              <div className="frame frame--right">
                <LoopVideo name="vibe2" className="frame__video" />
              </div>
              <figcaption>Or you're already there.</figcaption>
            </figure>
          </div>
        </section>

        {/* WHY PEOPLE ARE JOINING EARLY + FOMO */}
        <section className="section">
          <div className="container split">
            <div className="panel reveal">
              <span className="eyebrow">Why early</span>
              <h2 className="h2">
                Early means <em className="accent">everything</em>
              </h2>
              <ul className="ticks">
                <li>First access.</li>
                <li>First picks.</li>
                <li>First to know.</li>
              </ul>
              <p className="muted">The window closes soon.</p>
            </div>

            <div className="panel panel--glow reveal reveal--delay">
              <span className="eyebrow">Rolling invites</span>
              <h2 className="h2">We're not waiting for everyone</h2>
              <p className="lead">Early access goes to people who move now. Not people who think about it.</p>
              <p className="muted">
                Once we hit capacity, the list closes. Then it's just watching others talk about it.
              </p>
            </div>
          </div>
        </section>

        {/* REELS */}
        <ReelsSection />

        {/* SECOND EMAIL CAPTURE */}
        <section className="section" id="join">
          <div className="container container--narrow">
            <div className="cta-card reveal">
              <h2 className="h2 center">Don't be the person who waits</h2>
              <SignupForm
                cta="I'm In"
                note="Unsubscribe anytime. We respect your inbox."
                successMessage="Welcome to early access."
                centered
              />
            </div>
          </div>
        </section>

        {/* FINAL EMOTIONAL CLOSER */}
        <section className="section final">
          <div className="container container--narrow center reveal">
            <h2 className="final__title">
              The best nights start before <em className="accent">everyone else knows</em>
            </h2>
            <div className="frame frame--square">
              <LoopVideo name="final" className="frame__video" />
            </div>
            <p className="final__subtitle">
              You'll either be early.
              <br />
              Or you'll hear about it later.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__logo">
          dayzi<span className="nav__dot">.</span>
        </div>
        <div className="footer__social">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
            <Instagram size={22} />
          </a>
          <a href="https://x.com/Dayzi_events" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://www.youtube.com/@DAYZIPARTY" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube">
            <Youtube size={22} />
          </a>
        </div>
        <nav className="footer__links" aria-label="Legal">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/termsandconditions.html">Terms of Service</a>
          <a href="/deleteaccount.html">Delete Account</a>
        </nav>
        <p className="footer__copy">Dayzi © 2026</p>
      </footer>
    </div>
  );
}
