import { render, screen, within } from '@testing-library/react';
import App from './App';

function renderAt(path) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

beforeAll(() => {
  // jsdom has no media playback
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
});

test('home has the hero and both signup forms', () => {
  renderAt('/');
  expect(screen.getByRole('heading', { level: 1, name: /stop missing out/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /get early access|i’m in/i })).toHaveLength(2);
});

test.each([
  ['/how-it-works', /the tour/i],
  ['/safety', /show up safe/i],
  ['/faq', /good questions/i],
])('%s renders its page', (path, heading) => {
  renderAt(path);
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});

test('nav: How it works and Safety scroll to home sections, FAQ is its own page', () => {
  renderAt('/');
  const nav = screen.getByRole('navigation', { name: 'Main' });
  expect(within(nav).getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '/#how-it-works');
  expect(within(nav).getByRole('link', { name: 'Safety' })).toHaveAttribute('href', '/#safety');
  expect(within(nav).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
  expect(document.getElementById('how-it-works')).toBeInTheDocument();
  expect(document.getElementById('safety')).toBeInTheDocument();
});

// The home page is the one-look version. Detail belongs on /how-it-works,
// /safety and /faq; if this fails, move copy there instead of raising the cap.
test('home stays short: at most 110 visible words', () => {
  renderAt('/');
  const main = document.querySelector('main').cloneNode(true);
  main.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
  const words = main.textContent.split(/\s+/).filter(Boolean);
  expect(words.length).toBeLessThanOrEqual(110);
});

// The films came from a series ("Dayzi, explained", episodes 02 and 03) whose
// numbers mean nothing on the site, where there is no episode 01.
test.each(['/', '/how-it-works', '/safety', '/faq'])('%s has no episode numbers', (path) => {
  renderAt(path);
  const labels = [...document.querySelectorAll('[aria-label]')].map((el) => el.getAttribute('aria-label'));
  expect([document.body.textContent, ...labels].join(' ')).not.toMatch(/\bep\.|episode|nº/i);
});

test('unknown paths fall back to home', () => {
  renderAt('/nope');
  expect(screen.getByRole('heading', { level: 1, name: /stop missing out/i })).toBeInTheDocument();
});
