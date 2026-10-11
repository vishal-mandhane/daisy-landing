import React from 'react';
import { HOME_FEATURES, PROFILE_STEPS } from '../data';
import Clip from '../components/Clip';
import Title from '../components/Title';
import { JoinCta, NextPage, Polaroid, Ticker } from '../components/Layout';

function Feature({ item, index, tone }) {
  return (
    <article className={`feature feature--${tone} reveal`} style={{ transitionDelay: `${(index % 3) * 0.07}s` }}>
      <div className="feature__media">
        <Clip name={item.clip} label={`${item.label} in the Dayzi app`} />
        <span className="feature__n">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <Title parts={item.title} className="h-md" />
      <p className="muted">{item.body}</p>
    </article>
  );
}

export default function HowItWorks() {
  return (
    <>
      <section className="page-hero">
        <div className="hero__bg" style={{ backgroundImage: 'url(/app/film-profile.jpg)' }} aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero__grid">
            <div className="reveal">
              <p className="kicker kicker--light">How it works</p>
              <h1 className="h-hero">
                The <em>tour.</em>
              </h1>
              <p className="lead lead--light">Two short videos, then every step up close.</p>
            </div>
            <div className="films reveal reveal--late">
              <div className="film film--sm film--tilt-l">
                <Clip name="film-home" className="film__video" label="A tour of the home screen in the Dayzi app" />
                <div className="film__bar">
                  <span>Your home</span>
                </div>
              </div>
              <div className="film film--sm film--tilt-r">
                <Clip name="film-profile" className="film__video" label="Making your profile in the Dayzi app" />
                <div className="film__bar">
                  <span>Your profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Ticker />

      <section className="night section" id="home-feed">
        <div className="wrap">
          <h2 className="h-xl h-xl--light section-title reveal">
            Everything near you, <em>in one scroll.</em>
          </h2>
          <p className="swipe-hint">Swipe →</p>
          <div className="features">
            {HOME_FEATURES.map((item, i) => (
              <Feature key={item.clip} item={item} index={i} tone="night" />
            ))}
          </div>
        </div>
      </section>

      <section className="paper section" id="profile">
        <div className="wrap">
          <div className="section-head section-head--row reveal">
            <h2 className="h-xl">
              Your profile, <em>in six steps.</em>
            </h2>
            <div className="pol-row" aria-hidden="true">
              <Polaroid src="/app/pol-selfie.jpg" caption="yes, it’s really me." className="pol-row__a" />
              <Polaroid src="/app/pol-mia.jpg" caption="nice to meet you." className="pol-row__b" />
            </div>
          </div>
          <p className="swipe-hint">Swipe →</p>
          <div className="features">
            {PROFILE_STEPS.map((item, i) => (
              <Feature key={item.clip} item={item} index={i} tone="paper" />
            ))}
          </div>
        </div>
      </section>

      <section className="host section">
        <div className="wrap host__inner reveal">
          <h2 className="h-xl h-xl--light">
            Host it. <em>Pick your people.</em>
          </h2>
          <p className="lead lead--light">
            Create a plan in a minute, pick who gets in, and run it from the group chat.
          </p>
        </div>
      </section>

      <div className="paper">
        <div className="wrap">
          <NextPage to="/safety" label="Next" title="Safety" />
        </div>
      </div>
      <JoinCta />
    </>
  );
}
