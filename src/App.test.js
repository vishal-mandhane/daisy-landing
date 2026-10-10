import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the hero and the reels section', () => {
  render(<App />);
  expect(screen.getByText(/start showing up/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /see the vibe/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /get early access|i'm in/i })).toHaveLength(2);
});
