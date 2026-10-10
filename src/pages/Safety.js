import React from 'react';
import { MEET_SMART, SAFETY } from '../data';
import Clip from '../components/Clip';
import Title from '../components/Title';
import { JoinCta, Masthead, NextPage } from '../components/Layout';

export default function Safety() {
  return (
    <>
      <section className="page-hero paper">
        <div className="wrap">
          <Masthead right="Safety" />
          <div className="page-hero__grid">
            <div className="reveal">
              <p className="kicker">Safety</p>
              <h1 className="h-hero">
                Show up <em>safe.</em>
              </h1>
              <p className="lead">
                Meeting new people should feel exciting, not risky. Here’s what’s built into Dayzi, and how to look after
                yourself when you go.
              </p>
            </div>
            <div className="safety-hero reveal reveal--late">
              <div className="teaser__phone">
                <Clip name="p-badge" label="Getting the verified badge in Dayzi" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="night section">
        <div className="wrap">
          <Masthead right="What’s built in" />
          <ol className="safety-list">
            {SAFETY.map((item) => (
              <li key={item.n} className="safety-list__item reveal">
                <span className="safety-list__n">{item.n}</span>
                <Title parts={item.title} className="h-lg h-lg--light" />
                <p className="muted muted--light">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="paper section">
        <div className="wrap split split--top">
          <div className="reveal">
            <Masthead right="When you go" />
            <h2 className="h-xl">
              Meet <em>smart.</em>
            </h2>
            <p className="lead">
              Dayzi doesn’t organise or supervise events, and can’t vet everyone. These habits go a long way.
            </p>
          </div>
          <ul className="tips reveal reveal--late">
            {MEET_SMART.map((tip, i) => (
              <li key={tip}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="wrap">
          <p className="fineprint reveal">
            In danger? Call your local emergency number first. Read our{' '}
            <a href="/termsandconditions.html">Terms of Service</a> and <a href="/privacy.html">Privacy Policy</a> for the
            full details.
          </p>
          <NextPage to="/faq" label="Next" title="FAQ" />
        </div>
      </section>
      <JoinCta />
    </>
  );
}
