import React, { useEffect } from 'react';
import './App.css';
import { usePath } from './router';
import { canonicalUrl, normalizePath, pageMeta } from './seo';
import { useReveal } from './components/hooks';
import { Footer, Nav } from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Faq from './pages/Faq';
import Guide from './pages/Guide';
import { GUIDES } from './data';

function guidePage(path) {
  return function GuidePage() {
    return <Guide guide={GUIDES[path]} />;
  };
}

// Titles and descriptions live in seo.js, next to the structured data.
const PAGES = {
  '/': Home,
  '/how-it-works': HowItWorks,
  '/safety': Safety,
  '/faq': Faq,
  ...Object.fromEntries(Object.keys(GUIDES).map((path) => [path, guidePage(path)])),
};

// `initialPath` is only passed by the prerender (scripts/prerender.js).
export default function App({ initialPath }) {
  const path = normalizePath(usePath(initialPath));
  const Page = PAGES[path] || PAGES['/'];

  useReveal(path);

  // The prerendered HTML already has the right tags; this keeps them right
  // after moving to another page without a reload.
  useEffect(() => {
    const meta = pageMeta(path);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl(PAGES[path] ? path : '/'));
  }, [path]);

  // Deep links like /how-it-works#profile
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [path]);

  return (
    <div className="site">
      <Nav path={path} />
      <main key={path}>
        <Page />
      </main>
      <Footer />
    </div>
  );
}
