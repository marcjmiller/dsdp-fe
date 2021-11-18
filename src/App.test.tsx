import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders upload', () => {
  render(<App />);
  const uploadElement = screen.getByText(/Drag and drop a file here or click/i);
  expect(uploadElement).toBeInTheDocument();
});
