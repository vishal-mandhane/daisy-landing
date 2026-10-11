import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../router';
import Title from '../components/Title';
import { JoinCta, Ticker } from '../components/Layout';

function GuideLink({ to, href, label }) {
  if (href) {
    return (
      <a href={href} className="text-link" target="_blank" rel="noopener noreferrer">
        {label} <ArrowRight size={18} />
      </a>
    );
  }
  return (
    <Link to={to} className="text-link">
      {label} <ArrowRight size={18} />
    </Link>
  );
}

// One guide from GUIDES in data.js: the dark header, then the sections as an article.
export default function Guide({ guide }) {
  return (
    <>
      <section className="page-hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${guide.image})` }} aria-hidden="true" />
        <div className="wrap">
          <div className="reveal">
            <p className="kicker kicker--light">{guide.kicker}</p>
            <Title parts={guide.title} as="h1" className="h-hero" />
            <p className="lead lead--light">{guide.lead}</p>
          </div>
        </div>
      </section>
      <Ticker />

      <section className="paper section">
        <div className="wrap">
          <article className="guide">
            {guide.sections.map((s) => (
              <section key={s.h} className="guide__section reveal">
                <h2 className="h-lg">{s.h}</h2>
                {s.body?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.items && (
                  <ul className="guide__items">
                    {s.items.map(([lead, text]) => (
                      <li key={lead}>
                        <strong>{lead}</strong> {text}
                      </li>
                    ))}
                  </ul>
                )}
                {s.link && <GuideLink {...s.link} />}
              </section>
            ))}
          </article>
        </div>
      </section>
      <JoinCta />
    </>
  );
}
