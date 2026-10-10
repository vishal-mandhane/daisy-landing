import React, { useEffect } from 'react';
import './App.css';
import { usePath } from './router';
import { useReveal } from './components/hooks';
import { Footer, Nav } from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Faq from './pages/Faq';

const PAGES = {
  '/': { component: Home, title: 'Dayzi — Stop missing out. Start showing up.' },
  '/how-it-works': { component: HowItWorks, title: 'How it works — Dayzi' },
  '/safety': { component: Safety, title: 'Safety — Dayzi' },
  '/faq': { component: Faq, title: 'FAQ — Dayzi' },
};

export default function App() {
  const rawPath = usePath();
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
  const page = PAGES[path] || PAGES['/'];
  const Page = page.component;

  useReveal(path);

  useEffect(() => {
    document.title = page.title;
  }, [page]);

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
