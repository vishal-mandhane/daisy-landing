import React from 'react';
import { ArrowRight, BadgeCheck, Ghost, Phone, Users } from 'lucide-react';
import { Link } from '../router';
import { STEPS, TICKER } from '../data';
import Clip from '../components/Clip';
import Title from '../components/Title';
import SignupForm from '../components/SignupForm';
import Daisy from '../components/Daisy';
import { JoinCta, Masthead, Polaroid } from '../components/Layout';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" style={{ backgroundImage: "url(/app/film-home.jpg)" }} aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy reveal">
          <p className="kicker kicker--light">
            <span className="kicker__dot" /> Rolling invites · 18+
          </p>
          <h1 className="hero__title">
            Stop missing out.
            <br />
            Start <em>showing up.</em>
          </h1>
          <p className="hero__lead">
            Dayzi is where your city’s plans live. Rooftop gigs, supper clubs, Sunday football. Find one, ask to join,
            and meet the people going.
          </p>
          <SignupForm cta="Get early access" note="No spam. Just access." variant="dark" />
        </div>

        <div className="hero__film reveal reveal--late">
          <div className="film">
            <Clip name="film-home" className="film__video" label="Dayzi, explained. Episode 2: your home" />
            <div className="film__bar">
              <span>Dayzi, explained</span>
              <span>Ep. 02 · Your home</span>
            </div>
          </div>
          <Polaroid src="/app/pol-night.jpg" caption="perfect night out." className="hero__pol" />
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
                <Daisy size={18} petal="#FFFFFF" center="#F5C518" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Steps() {
  return (
    <section className="paper section">
      <div className="wrap">
        <Masthead right="Nº 01 · How it works" />
        <div className="section-head reveal">
          <p className="kicker">Three steps</p>
          <h2 className="h-xl">
            From <em>“we should”</em> to <em>“we did.”</em>
          </h2>
        </div>
        <p className="swipe-hint">Swipe →</p>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className="step reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="step__media">
                <Clip name={s.clip} label={`${s.label} in the Dayzi app`} />
              </div>
              <div className="step__text">
                <span className="step__n">{s.n}</span>
                <div>
                  <p className="kicker">{s.label}</p>
                  <Title parts={s.title} className="h-md" />
                  <p className="muted">{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="center reveal">
          <Link to="/how-it-works" className="btn btn--ink">
            Take the full tour <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProfileTeaser() {
  return (
    <section className="paper paper--deep section">
      <div className="wrap split">
        <div className="reveal">
          <Masthead right="Nº 02 · Your profile" />
          <h2 className="h-xl">
            More than <em>a selfie.</em>
          </h2>
          <p className="lead">
            Five vibes, an anthem, a show you’d rewatch and three prompts that sound like you. Hosts see it when you ask
            to join, so every plan fills up with your kind of people.
          </p>
          <Link to="/how-it-works#profile" className="text-link">
            Build your profile <ArrowRight size={18} />
          </Link>
        </div>
        <div className="teaser reveal reveal--late">
          <div className="teaser__phone">
            <Clip name="p-mia" label="A Dayzi profile" />
          </div>
          <Polaroid src="/app/pol-karaoke.jpg" caption="karaoke, obviously." className="teaser__pol teaser__pol--a" />
        </div>
      </div>
    </section>
  );
}

function SafetyStrip() {
  const items = [
    { icon: BadgeCheck, title: 'Face-verified', body: 'A quick selfie check. The selfie isn’t kept.' },
    { icon: Users, title: 'Hosts choose', body: 'Ask to join. The host decides who’s in.' },
    { icon: Ghost, title: 'Ghost counter', body: 'No-shows show up on your profile.' },
    { icon: Phone, title: 'SOS', body: 'One tap reaches the person you picked.' },
  ];
  return (
    <section className="night section">
      <div className="wrap">
        <div className="safety-strip__head reveal">
          <h2 className="h-xl h-xl--light">
            Real people. <em>Real plans.</em>
          </h2>
          <Link to="/safety" className="text-link text-link--light">
            How we keep it safe <ArrowRight size={18} />
          </Link>
        </div>
        <div className="safety-strip">
          {items.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="safety-strip__item reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
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
      <ProfileTeaser />
      <SafetyStrip />
      <JoinCta />
    </>
  );
}
