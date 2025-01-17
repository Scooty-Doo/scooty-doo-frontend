/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import GitHubLogin from '../pages/oauth/GitHubLogin';
import { fetchLogin } from '../api/oauthApi';
import '@testing-library/jest-dom';

// Mocka fetchLogin och useNavigate
jest.mock('../api/oauthApi', () => ({
    fetchLogin: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('GitHubLogin Component', () => {
    const mockNavigate = jest.fn();
    const setToken = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });
    test('navigates to /homeclient on successful login', async () => {
        const mockToken = 'abcd1234';
        fetchLogin.mockResolvedValueOnce({ access_token: mockToken }); // matchar med implementationen
        const searchParams = new URLSearchParams({ code: 'github_code' });
        delete window.location;
        window.location = new URL(`http://localhost/?${searchParams.toString()}`);
    
        render(
            <MemoryRouter>
                <GitHubLogin />
            </MemoryRouter>
        );
    
        expect(screen.getByText('Processing GitHub login...')).toBeInTheDocument();
    
        // Vänta på API-svaret
        await waitFor(() => {
            expect(fetchLogin).toHaveBeenCalledWith('github_code', null); // Förväntar sig både code och role
            expect(sessionStorage.getItem('token')).toBe(mockToken);
            expect(mockNavigate).toHaveBeenCalledWith('/homeclient', { replace: true });
        });
    });
    
    test('navigates to / if login fails', async () => {
        fetchLogin.mockRejectedValueOnce(new Error('Login failed'));
        const searchParams = new URLSearchParams({ code: 'invalid_code' });
        delete window.location;
        window.location = new URL(`http://localhost/?${searchParams.toString()}`);
    
        render(
            <MemoryRouter>
                <GitHubLogin />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(fetchLogin).toHaveBeenCalledWith('invalid_code', null); // Förväntar sig både code och role
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
    

    test('redirects to / if no code is present in URL', () => {
        delete window.location;
        window.location = new URL(`http://localhost/`);

        render(
            <MemoryRouter>
                <GitHubLogin setToken={setToken} />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
