import React, { useState } from 'react';
import { ArrowRight, Instagram, Menu, X as Close, Youtube } from 'lucide-react';
import { Link } from '../router';
import { NAV, SOCIAL } from '../data';
import Logo from './Logo';
import SignupForm from './SignupForm';

export function Nav({ path }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link to="/" className="brand" aria-label="Dayzi home" onClick={close}>
          <Logo size={30} />
          <span>Dayzi</span>
        </Link>
        <nav className={`nav__links${open ? ' is-open' : ''}`} aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              aria-current={path === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/#join" className="btn btn--red btn--sm" onClick={close}>
            Get early access
          </Link>
        </nav>
        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

// The editorial rule from the videos: "DAYZI, EXPLAINED ———— Nº 02 · YOUR HOME"
export function Masthead({ left = 'Dayzi, explained', right }) {
  return (
    <div className="masthead">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

export function Polaroid({ src, caption, className = '' }) {
  return (
    <figure className={`polaroid ${className}`}>
      <img src={src} alt="" loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function NextPage({ to, label, title }) {
  return (
    <Link to={to} className="next-page">
      <span className="next-page__label">{label}</span>
      <span className="next-page__title">
        {title} <ArrowRight size={28} />
      </span>
    </Link>
  );
}

export function JoinCta({ id = 'join' }) {
  return (
    <section className="cta" id={id}>
      <div className="wrap cta__inner reveal">
        <p className="kicker kicker--light">
          <span className="kicker__dot" /> Rolling invites
        </p>
        <h2 className="cta__title">
          The best nights start before <em>everyone else knows.</em>
        </h2>
        <p className="cta__lead">You’ll either be early, or you’ll hear about it later.</p>
        <SignupForm
          cta="I’m in"
          note="No spam. Unsubscribe anytime."
          successMessage="Welcome to early access."
          variant="dark"
        />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo size={44} />
            <div>
              <div className="footer__name">Dayzi</div>
              <div className="footer__tag">
                Stop missing out. <em>Start showing up.</em>
              </div>
            </div>
          </div>
          <div className="footer__cols">
            <nav aria-label="Explore">
              <span className="footer__head">Explore</span>
              <Link to="/">Home</Link>
              {NAV.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Legal">
              <span className="footer__head">Legal</span>
              <a href="/privacy.html">Privacy Policy</a>
              <a href="/termsandconditions.html">Terms of Service</a>
              <a href="/deleteaccount.html">Delete Account</a>
            </nav>
            <div>
              <span className="footer__head">Follow</span>
              <div className="footer__social">
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" aria-label="X">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="masthead masthead--footer">
          <span>dayzi.live</span>
          <span>© 2026 Solika Ventures Pvt Ltd</span>
        </div>
      </div>
    </footer>
  );
}
