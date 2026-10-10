import React, { useState } from 'react';
import {
  BadgeCheck,
  Ghost,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Tv,
  Users,
  X as Close,
  Youtube,
} from 'lucide-react';
import './App.css';
import Daisy from './components/Daisy';
import SignupForm from './components/SignupForm';
import { LoopVideo, useReveal } from './components/hooks';
import { FAQ, SAFETY, SAMPLE_EVENTS, SOCIAL, STEPS, TICKER } from './data';

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#safety', label: 'Safety' },
  { href: '#faq', label: 'FAQ' },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a href="#top" className="brand" aria-label="Dayzi home">
          <Daisy size={30} spin petal="#141210" />
          <span>dayzi</span>
        </a>
        <nav className={`nav__links${open ? ' is-open' : ''}`} aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#join" className="btn btn--sun btn--sm" onClick={() => setOpen(false)}>
            Join the list
          </a>
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

function PhoneMockup() {
  return (
    <div className="phone" aria-label="Preview of the Dayzi app showing plans nearby" role="img">
      <div className="phone__notch" />
      <div className="phone__screen">
        <div className="phone__top">
          <span className="phone__hello">Plans near you</span>
          <span className="phone__pin">
            <MapPin size={12} /> Tonight
          </span>
        </div>
        <div className="phone__filters">
          <span className="is-on">All</span>
          <span>Music</span>
          <span>Outdoors</span>
          <span>Food</span>
        </div>
        {SAMPLE_EVENTS.map((ev) => (
          <div className={`evt evt--${ev.tone}`} key={ev.title}>
            <div className="evt__tag">{ev.tag}</div>
            <div className="evt__title">{ev.title}</div>
            <div className="evt__meta">
              <span>{ev.when}</span>
              <span className="evt__going">
                <Users size={12} /> {ev.going}/{ev.cap}
              </span>
            </div>
            <div className="evt__bar">
              <span style={{ width: `${(ev.going / ev.cap) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__grid">
        <div className="hero__copy reveal">
          <p className="stamp">
            <span className="stamp__dot" /> Rolling invites · 18+
          </p>
          <h1 className="hero__title">
            Stop missing out.
            <span className="hero__title-alt">
              Start <em>showing up.</em>
            </span>
          </h1>
          <p className="hero__lead">
            Dayzi is where the city's plans live. Rooftops, run clubs, gigs, game nights. Find one, ask to join, and
            meet the people going.
          </p>
          <SignupForm cta="Get early access" note="No spam. Just access." />
        </div>

        <div className="hero__art reveal reveal--late">
          <Daisy size={150} spin petal="#FFC93C" center="#FF5A36" className="hero__daisy" />
          <PhoneMockup />
          <div className="float float--a">
            <BadgeCheck size={16} /> Verified
          </div>
          <div className="float float--b">
            <MessageCircle size={16} /> +3 joined the chat
          </div>
          <div className="float float--c">Request accepted ✿</div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((n) => (
          <div className="ticker__group" key={n}>
            {TICKER.map((word) => (
              <span key={word} className="ticker__item">
                {word}
                <Daisy size={22} petal="#141210" center="#FF5A36" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">How it works</p>
          <h2 className="display">
            Three taps from <em>"we should"</em> to <em>"we did."</em>
          </h2>
        </div>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className={`ticket ticket--${i} reveal`} key={s.n} style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="ticket__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="ticket__stub" aria-hidden="true">
                ADMIT ONE
              </span>
            </li>
          ))}
        </ol>

        <div className="host reveal">
          <div className="host__icon">
            <Plus size={28} />
          </div>
          <div>
            <h3>Got an idea for Saturday? Host it.</h3>
            <p>
              Create a plan in a minute, pick who gets in from the requests, and run it from the group chat. Stuck on
              the description? Dayzi can write it for you.
            </p>
          </div>
          <Sparkles className="host__spark" size={36} />
        </div>
      </div>
    </section>
  );
}

function Profiles() {
  return (
    <section className="section section--lilac">
      <div className="wrap split">
        <div className="reveal">
          <p className="label">Profiles</p>
          <h2 className="display">
            More than <em>a selfie.</em>
          </h2>
          <p className="body-lg">
            Your vibes, your favourite song, the show you'd rewatch forever, and a few prompts that say who you are.
            Hosts see it when you ask to join, so the room fills with your kind of people.
          </p>
          <ul className="checks">
            <li>
              <BadgeCheck size={20} /> A verified badge means a real person
            </li>
            <li>
              <Ghost size={20} /> A ghost counter so flakes are visible
            </li>
          </ul>
        </div>

        <div className="profile reveal reveal--late" role="img" aria-label="Example Dayzi profile card">
          <div className="profile__head">
            <div className="profile__avatar">A</div>
            <div>
              <div className="profile__name">
                Aanya <BadgeCheck size={18} className="profile__tick" />
              </div>
              <div className="profile__user">@aanya.outside</div>
            </div>
            <div className="profile__ghost">
              <Ghost size={14} /> 0
            </div>
          </div>
          <div className="profile__vibes">
            <span>Sunset chaser</span>
            <span>Says yes</span>
            <span>Playlist DJ</span>
            <span>Dog person</span>
          </div>
          <div className="profile__rows">
            <div>
              <Music2 size={16} />
              <span className="profile__k">Favourite song</span>
              <span className="profile__v">Something with a big chorus</span>
            </div>
            <div>
              <Tv size={16} />
              <span className="profile__k">Favourite show</span>
              <span className="profile__v">The Office (obviously)</span>
            </div>
          </div>
          <div className="profile__prompt">
            <span>Most likely to</span>
            <strong>say "one more place" at 1 AM.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fomo() {
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="display center reveal">
          There are two kinds <br className="br-desk" />
          of <em>people.</em>
        </h2>
        <div className="fomo">
          <figure className="polaroid polaroid--l reveal">
            <LoopVideo name="vibe1" className="polaroid__media" />
            <figcaption>You hear about it the next day.</figcaption>
          </figure>
          <span className="fomo__vs reveal" aria-hidden="true">
            vs
          </span>
          <figure className="polaroid polaroid--r reveal reveal--late">
            <LoopVideo name="vibe2" className="polaroid__media" />
            <figcaption>Or you're already there.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

const SAFETY_ICONS = {
  verified: BadgeCheck,
  ghost: Ghost,
  sos: Phone,
  shield: ShieldCheck,
};

function Safety() {
  return (
    <section className="section section--mint" id="safety">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">Safety</p>
          <h2 className="display">
            Real people. <em>Real plans.</em>
          </h2>
          <p className="body-lg">Showing up should feel easy. Here's what we built so it does.</p>
        </div>
        <div className="safety">
          {SAFETY.map((item, i) => {
            const Icon = SAFETY_ICONS[item.icon];
            return (
              <article className="safe-card reveal" key={item.title} style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="safe-card__icon">
                  <Icon size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap split split--faq">
        <div className="reveal">
          <p className="label">FAQ</p>
          <h2 className="display">
            Good <em>questions.</em>
          </h2>
          <p className="body-lg">
            Anything else? DM us on{' '}
            <a className="link" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            .
          </p>
        </div>
        <div className="faq reveal reveal--late">
          {FAQ.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>
                {item.q}
                <Plus size={20} className="faq__icon" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final" id="join">
      <div className="wrap final__grid">
        <div className="final__copy reveal">
          <h2 className="final__title">
            The best nights start before <em>everyone else knows.</em>
          </h2>
          <p className="final__lead">You'll either be early, or you'll hear about it later.</p>
          <SignupForm
            cta="I'm in"
            note="Unsubscribe anytime. We respect your inbox."
            successMessage="Welcome to early access."
            variant="sun"
          />
        </div>
        <div className="final__art reveal reveal--late">
          <div className="final__frame">
            <LoopVideo name="final" className="final__video" />
          </div>
          <Daisy size={110} spin petal="#FFFFFF" center="#141210" className="final__daisy" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Daisy size={44} spin petal="#F3EEE3" />
          <span>dayzi</span>
        </div>
        <p className="footer__tag">Stop missing out. Start showing up.</p>
        <div className="footer__social">
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
            <Instagram size={20} />
          </a>
          <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" aria-label="Follow us on X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube">
            <Youtube size={20} />
          </a>
        </div>
        <nav className="footer__links" aria-label="Legal">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/termsandconditions.html">Terms of Service</a>
          <a href="/deleteaccount.html">Delete Account</a>
        </nav>
        <p className="footer__copy">
          © 2026 Solika Ventures Pvt Ltd · Made in India
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  return (
    <div className="page">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <Profiles />
        <Fomo />
        <Safety />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
