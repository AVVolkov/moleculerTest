import React from './node_modules/reacte_modules/react';
import { render } from './node_modules/@testing-library/reactg-library/react';
import App from './app';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
