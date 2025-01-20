// ZoneAdmin.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ZoneAdmin from '../pages/admin/ZoneAdmin';

// Mock useNavigate to return a mock function
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('ZoneAdmin Component', () => {
    it('should render MapWithZones component', () => {
    // Mock sessionStorage to simulate missing token
        const sessionStorageMock = (key) => {
            if (key === 'token') return null;
        };

        // Save the original sessionStorage
        const originalSessionStorage = global.sessionStorage;
        global.sessionStorage = { getItem: sessionStorageMock };

        render(
            <Router>
                <ZoneAdmin />
            </Router>
        );

        // Check if MapWithZones is rendered
        expect(screen.getByText(/MapWithZones/i)).toBeInTheDocument();

        // Restore the original sessionStorage after the test
        global.sessionStorage = originalSessionStorage;
    });

    it('should redirect to home if token is missing', async () => {
        const mockNavigate = jest.fn();

        // Assign mockNavigate to useNavigate
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

        // Mock sessionStorage to simulate missing token
        const sessionStorageMock = (key) => {
            if (key === 'token') return null;
        };

        // Save the original sessionStorage
        const originalSessionStorage = global.sessionStorage;
        global.sessionStorage = { getItem: sessionStorageMock };

        render(
            <Router>
                <ZoneAdmin />
            </Router>
        );

        // Simulate the behavior of navigate when the token is missing
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        // Restore the original sessionStorage after the test
        global.sessionStorage = originalSessionStorage;
    });
});
