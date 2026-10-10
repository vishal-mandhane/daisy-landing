import React from 'react';
import { HOME_FEATURES, PROFILE_STEPS } from '../data';
import Clip from '../components/Clip';
import Title from '../components/Title';
import { JoinCta, Masthead, NextPage, Polaroid } from '../components/Layout';

function Feature({ item, index, tone }) {
  return (
    <article className={`feature feature--${tone} reveal`} style={{ transitionDelay: `${(index % 3) * 0.07}s` }}>
      <div className="feature__media">
        <Clip name={item.clip} label={`${item.label} in the Dayzi app`} />
        <span className="feature__n">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <p className="kicker">{item.label}</p>
      <Title parts={item.title} className="h-md" />
      <p className="muted">{item.body}</p>
    </article>
  );
}

export default function HowItWorks() {
  return (
    <>
      <section className="page-hero paper">
        <div className="wrap">
          <Masthead right="The tour · 2 episodes" />
          <div className="page-hero__grid">
            <div className="reveal">
              <p className="kicker">How it works</p>
              <h1 className="h-hero">
                The <em>tour.</em>
              </h1>
              <p className="lead">
                Two short episodes: the home where your city’s plans live, and the profile that gets you in. Then the
                details, one scene at a time.
              </p>
              <div className="chapters">
                <a href="#home-feed" className="chapter-link">
                  <span>Ep. 02</span> Your home
                </a>
                <a href="#profile" className="chapter-link">
                  <span>Ep. 03</span> Your profile
                </a>
              </div>
            </div>
            <div className="films reveal reveal--late">
              <div className="film film--sm film--tilt-l">
                <Clip name="film-home" className="film__video" label="Dayzi, explained. Episode 2: your home" />
                <div className="film__bar">
                  <span>Ep. 02</span>
                  <span>Your home</span>
                </div>
              </div>
              <div className="film film--sm film--tilt-r">
                <Clip name="film-profile" className="film__video" label="Dayzi, explained. Episode 3: your profile" />
                <div className="film__bar">
                  <span>Ep. 03</span>
                  <span>Your profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="night section" id="home-feed">
        <div className="wrap">
          <Masthead right="Nº 02 · Your home" />
          <div className="section-head section-head--row reveal">
            <h2 className="h-xl h-xl--light">
              Everything near you, <em>in one scroll.</em>
            </h2>
            <p className="muted muted--light">
              Plans ranked by what’s hot, a row for every kind of night, and your own plans pinned on top.
            </p>
          </div>
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
          <Masthead right="Nº 03 · Your profile" />
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
          <p className="kicker kicker--light">Got an idea for Saturday?</p>
          <h2 className="h-xl h-xl--light">
            Host it. <em>Pick your people.</em>
          </h2>
          <p className="lead lead--light">
            Create a plan in a minute, choose who gets in from the requests, and run it from the group chat. Stuck on
            the description? Dayzi can write it for you.
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
