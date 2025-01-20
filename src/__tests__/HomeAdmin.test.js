import React from 'react';
import { render } from '@testing-library/react';
import HomeAdmin from '../pages/admin/HomeAdmin';
import { BrowserRouter as Router } from 'react-router-dom';
import { io } from 'socket.io-client';

// Mock necessary parts
jest.mock('socket.io-client', () => {
    return {
        io: jest.fn().mockReturnValue({
            connect: jest.fn(),
        }),
    };
});
jest.mock('../components/ListBikeCity', () => jest.fn(() => <div>ListBikeCity</div>));
jest.mock('../components/MapAdmin', () => jest.fn(() => <div>MapAdmin</div>));
jest.mock('../components/SelectCityAdmin', () => jest.fn(({ onCitySelect }) => (
    <button onClick={() => onCitySelect('Test City')}>Select City</button>
)));

describe('HomeAdmin Component', () => {
    beforeEach(() => {
        sessionStorage.clear(); // Clear sessionStorage before each test to ensure a clean slate
    });

    test('socket connection is made', () => {
        sessionStorage.setItem('token', 'mockToken');
        
        // Setup mock socket connection correctly
        const mockSocket = { connect: jest.fn() };
        io.mockReturnValue(mockSocket); // Ensure the mock returns an object with connect method

        render(
            <Router>
                <HomeAdmin token="mockToken" />
            </Router>
        );

        // Verify socket connection is established
        expect(mockSocket.connect).toHaveBeenCalledTimes(1);
    });
});
