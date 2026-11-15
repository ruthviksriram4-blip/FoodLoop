import { render, screen } from '@testing-library/react';
import HomePage from './pages/HomePage';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) =>
    require('react').createElement('a', { href: to, ...props }, children),
}));

test('renders the FoodLoop home page', () => {
  render(<HomePage />);
  expect(
    screen.getByRole('heading', { name: /Share Surplus Food/i })
  ).toBeInTheDocument();
});
