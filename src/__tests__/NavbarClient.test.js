import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import NavbarClient from '../components/NavbarClient';
import '@testing-library/jest-dom';

describe('NavbarClient Component', () => {
    test('renders navigation links', () => {
        render(
            <MemoryRouter>
                <NavbarClient />
            </MemoryRouter>
        );

        // Testa om navigeringslänkarna finns och visas korrekt
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Account')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();

        // Testa om det finns 5 länkar i DOM:en (loggan räknas)
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(5);
    });

    test('links have correct href attributes', () => {
        render(
            <MemoryRouter>
                <NavbarClient />
            </MemoryRouter>
        );

        // Testa att länkarna har rätt URL
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/homeclient');
        expect(screen.getByText('Account').closest('a')).toHaveAttribute('href', '/accountclient');
        expect(screen.getByText('History').closest('a')).toHaveAttribute('href', '/historyclient');
        expect(screen.getByText('Logout').closest('a')).toHaveAttribute('href', '/');
    });
});
