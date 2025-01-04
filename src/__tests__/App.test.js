import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import App from '../App';

describe('Test main app functionality', () => {
  test('renders and displays login form on home screen', async () => {
    await act(async () => {
      render(<App />);
    });
    // Kontrollera att "Login" visas på sidan
    const loginText = await screen.findByText('Login');
    expect(loginText).toBeInTheDocument();
  });
});
