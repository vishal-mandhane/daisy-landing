import React, { useEffect, useState } from 'react';

// A tiny client-side router: real URLs (/safety, /faq...) without a dependency.
// vercel.json rewrites those paths to index.html so they also work on reload.

const NAV_EVENT = 'dayzi:navigate';

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    window.addEventListener(NAV_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(NAV_EVENT, update);
    };
  }, []);
  return path;
}

export function navigate(to) {
  const [pathname, hash] = to.split('#');
  const target = pathname || window.location.pathname;
  if (target !== window.location.pathname) {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new Event(NAV_EVENT));
  } else if (hash) {
    window.history.replaceState({}, '', to);
  }
  // Wait for the new page to render, then scroll.
  requestAnimationFrame(() => {
    const el = hash && document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });
}

export function Link({ to, onClick, children, ...rest }) {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
