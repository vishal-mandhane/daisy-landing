import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the hero, sections and both signup forms', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /stop missing out/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /previously/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /real people/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /get early access|i'm in/i })).toHaveLength(2);
});
