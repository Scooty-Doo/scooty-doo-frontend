import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import App from '../App';

describe('Test main app functionality', () => {
  test('renders and displays login form on home screen', async () => {
    render(<App />);
    // Kontrollera att "Login" visas på sidan
    const loginText = await screen.findByText('Login');
    expect(loginText).toBeInTheDocument();
  });
});
