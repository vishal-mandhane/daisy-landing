import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Instagram, Menu, X as Close, Youtube } from 'lucide-react';
import { Link } from '../router';
import { GUIDE_LINKS, NAV, SOCIAL, TICKER } from '../data';
import Daisy from './Daisy';
import Logo from './Logo';
import SignupForm from './SignupForm';

// On phones the menu button opens one list with every page; the guides sit
// under a "Guides" label. On laptops the guides are a dropdown.
export function Nav({ path }) {
  const [open, setOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const guidesRef = useRef(null);
  const close = () => {
    setOpen(false);
    setGuidesOpen(false);
  };

  // Close the dropdown on a click outside it, or on Escape.
  useEffect(() => {
    if (!guidesOpen) return undefined;
    const onPointer = (e) => {
      if (!guidesRef.current?.contains(e.target)) setGuidesOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setGuidesOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [guidesOpen]);

  const onGuide = GUIDE_LINKS.some((item) => item.to === path);
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
          <div className={`nav__menu${guidesOpen ? ' is-open' : ''}${onGuide ? ' is-current' : ''}`} ref={guidesRef}>
            <span className="nav__menu-label">Guides</span>
            <button
              type="button"
              className="nav__menu-toggle"
              aria-expanded={guidesOpen}
              aria-controls="nav-guides"
              onClick={() => setGuidesOpen((v) => !v)}
            >
              Guides <ChevronDown size={16} aria-hidden="true" />
            </button>
            <div className="nav__menu-list" id="nav-guides">
              {GUIDE_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  aria-current={path === item.to ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
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

// The red band under every page's dark hero.
export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((n) => (
          <div className="ticker__group" key={n}>
            {TICKER.map((word) => (
              <span key={word} className="ticker__item">
                {word}
                <Daisy size={18} petal="#FFFFFF" center="#F5C518" />
              </span>
            ))}
          </div>
        ))}
      </div>
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
        <h2 className="cta__title">
          Next time they bail, <em>go anyway.</em>
        </h2>
        <SignupForm
          cta="I’m in"
          note="No spam · Unsubscribe any time"
          successMessage="You’re on the list."
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
            <nav aria-label="Guides">
              <span className="footer__head">Guides</span>
              {GUIDE_LINKS.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Legal">
              <span className="footer__head">Legal</span>
              <a href="/privacy.html">Privacy Policy</a>
              <a href="/termsandconditions.html">Terms of Service</a>
              <a href="/community-guidelines.html">Community Guidelines</a>
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
