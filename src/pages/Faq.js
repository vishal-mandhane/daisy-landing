import React from 'react';
import { Plus } from 'lucide-react';
import { FAQ, SOCIAL } from '../data';
import { JoinCta, Masthead, Polaroid } from '../components/Layout';

export default function Faq() {
  return (
    <>
      <section className="page-hero paper">
        <div className="wrap">
          <Masthead right="FAQ" />
          <div className="split split--top faq-page">
            <div className="reveal">
              <p className="kicker">FAQ</p>
              <h1 className="h-hero">
                Good <em>questions.</em>
              </h1>
              <p className="lead">
                Anything else? DM us on{' '}
                <a className="inline-link" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                .
              </p>
              <Polaroid src="/app/pol-karaoke.jpg" caption="see you there." className="faq-page__pol" />
            </div>
            <div className="faq reveal reveal--late">
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
          </div>
        </div>
      </section>
      <JoinCta />
    </>
  );
}
