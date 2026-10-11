import React from 'react';
import { ArrowRight, BadgeCheck, Ghost, Phone, Users } from 'lucide-react';
import { Link } from '../router';
import { SAFETY_SHORT, STEPS } from '../data';
import Clip from '../components/Clip';
import SignupForm from '../components/SignupForm';
import { JoinCta, Polaroid, Ticker } from '../components/Layout';

// The home page is the one-look version: what Dayzi is, how it works in three
// steps, why it's safe, and one action. Everything else lives on the detail pages.

function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" style={{ backgroundImage: "url(/app/film-home.jpg)" }} aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy reveal">
          <h1 className="hero__title">
            Stop missing out.
            <br />
            Start <em>showing up.</em>
          </h1>
          <p className="hero__lead">Find plans near you, ask to join, and meet the people going.</p>
          <SignupForm cta="Get early access" note="Rolling invites · 18+ · No spam" variant="dark" />
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
            Real people. <em>Real plans.</em>
          </h2>
          <Link to="/safety" className="text-link text-link--light">
            How we keep it safe <ArrowRight size={18} />
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
      <JoinCta />
    </>
  );
}
