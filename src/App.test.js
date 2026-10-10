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

test('unknown paths fall back to home', () => {
  renderAt('/nope');
  expect(screen.getByRole('heading', { level: 1, name: /stop missing out/i })).toBeInTheDocument();
});
