/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginClient from '../pages/customer/LoginClient';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock för miljövariabler
process.env.REACT_APP_GITHUB_CLIENT_DEV = 'devClientId';
process.env.REACT_APP_GITHUB_CLIENT = 'prodClientId';

describe('LoginClient Component', () => {
    const basename = '/app';

    beforeEach(() => {
        document.body.className = '';  // Rensa body-klasser inför varje test
    });

    test('renders LoginClient correctly', () => {
        render(
            <MemoryRouter>
                <LoginClient basename={basename} />
            </MemoryRouter>
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    test('adds and removes body class on mount/unmount', () => {
        const { unmount } = render(
            <MemoryRouter>
                <LoginClient basename={basename} />
            </MemoryRouter>
        );

        // Kontrollera att klassen läggs till
        expect(document.body.classList.contains('loginBody')).toBe(true);

        // Kontrollera att klassen tas bort
        unmount();
        expect(document.body.classList.contains('loginBody')).toBe(false);
    });

    test('redirects to GitHub login on button click', () => {
        delete window.location;
        window.location = { href: 'http://localhost/app' };  // Mocka window.location
    
        render(
            <MemoryRouter>
                <LoginClient basename={basename} />
            </MemoryRouter>
        );
    
        const githubButton = screen.getByText('GitHub');
    
        fireEvent.click(githubButton);
    
        const expectedClientId = process.env.NODE_ENV === 'production' ? 'prodClientId' : 'devClientId';
        const expectedRedirectUri = `http://localhost/app#/githublogin`;
    
        expect(window.location.href).toBe(
            `https://github.com/login/oauth/authorize?client_id=${expectedClientId}&redirect_uri=${expectedRedirectUri}`
        );
    });
    
    
    
});
