import React from 'react';
import { Plus } from 'lucide-react';
import { FAQ, GUIDE_LINKS, SOCIAL } from '../data';
import { Link } from '../router';
import { JoinCta, Polaroid, Ticker } from '../components/Layout';

export default function Faq() {
  return (
    <>
      <section className="page-hero">
        <div className="hero__bg" style={{ backgroundImage: 'url(/app/pol-karaoke.jpg)' }} aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero__grid">
            <div className="reveal">
              <p className="kicker kicker--light">FAQ</p>
              <h1 className="h-hero">
                Good <em>questions.</em>
              </h1>
              <p className="lead lead--light">
                Anything else? DM us on{' '}
                <a className="inline-link" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                .
              </p>
            </div>
            <div className="reveal reveal--late">
              <Polaroid src="/app/pol-karaoke.jpg" caption="see you there." className="faq-page__pol" />
            </div>
          </div>
        </div>
      </section>
      <Ticker />

      <section className="paper section">
        <div className="wrap faq-page">
          <div className="faq reveal">
            {FAQ.map((item, i) => (
              <details key={item.q} className="faq__item" open={i === 0}>
                <summary>
                  <span className="faq__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq__q">{item.q}</span>
                  <Plus size={20} className="faq__icon" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p className="fineprint reveal">
            Guides:{' '}
            {GUIDE_LINKS.map((item, i) => (
              <React.Fragment key={item.to}>
                {i > 0 && ' · '}
                <Link to={item.to}>{item.label}</Link>
              </React.Fragment>
            ))}
          </p>
        </div>
      </section>
      <JoinCta />
    </>
  );
}
