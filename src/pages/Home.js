import React from 'react';
import { ArrowRight, BadgeCheck, Ghost, Phone, Users } from 'lucide-react';
import { Link } from '../router';
import { SAFETY_SHORT, STEPS } from '../data';
import Clip from '../components/Clip';
import StoreBadges from '../components/StoreBadges';
import { Polaroid, Ticker } from '../components/Layout';

// The home page is the one-look version: what Dayzi is, how it works in three
// steps, why it's safe, and the store badges. Everything else lives on the
// detail pages.

// #download: where every "Download Dayzi" button and dayzi.live/download on a
// laptop land.
function Hero() {
  return (
    <section className="hero" id="download">
      <div className="hero__bg" style={{ backgroundImage: "url(/app/film-home.jpg)" }} aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy reveal">
          {/* The brand name next to the h1: what someone searching "dayzi" should land on. */}
          <p className="kicker kicker--light">Dayzi app</p>
          <h1 className="hero__title">
            Stop missing out.
            <br />
            Start <em>showing up.</em>
          </h1>
          <p className="hero__lead">Friends bailed? Ask to join people near you who are already going, and go anyway.</p>
          <StoreBadges />
        </div>

        <div className="hero__film reveal reveal--late">
          <div className="film">
            <Clip name="film-home" className="film__video" label="A tour of the home screen in the Dayzi app" />
          </div>
          <Polaroid src="/app/pol-night.jpg" caption="perfect night out." className="hero__pol" />
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="paper section" id="how-it-works">
      <div className="wrap">
        <h2 className="h-xl section-title section-title--center reveal">
          How it <em>works.</em>
        </h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className="step reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="step__media">
                <Clip name={s.clip} label={`${s.label} in the Dayzi app`} />
              </div>
              <div className="step__text">
                <span className="step__n">{s.n}</span>
                <div>
                  <h3 className="h-md">{s.label}</h3>
                  <p className="muted">{s.line}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="center reveal">
          <Link to="/how-it-works" className="btn btn--ink">
            See the full tour <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const SAFETY_ICONS = { badge: BadgeCheck, users: Users, ghost: Ghost, phone: Phone };

function SafetyStrip() {
  return (
    <section className="night section" id="safety">
      <div className="wrap">
        <div className="safety-strip__head reveal">
          <h2 className="h-xl h-xl--light">
            Know who’s going. <em>Before you go.</em>
          </h2>
          <Link to="/safety" className="text-link text-link--light">
            How safety works on Dayzi <ArrowRight size={18} />
          </Link>
        </div>
        <ul className="safety-strip">
          {SAFETY_SHORT.map(({ icon, text }, i) => {
            const Icon = SAFETY_ICONS[icon];
            return (
              <li key={text} className="safety-strip__item reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <Icon size={22} aria-hidden="true" />
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
        <div className="center reveal">
          <Link to="/#download" className="btn btn--red">
            Download Dayzi <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Steps />
      <SafetyStrip />
    </>
  );
}
