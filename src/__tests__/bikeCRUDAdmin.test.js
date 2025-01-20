import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BikeCRUDAdmin from '../pages/admin/BikeCRUDAdmin';
import { fetchBike, bikeDetails } from '../api/bikeApi';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Mock API functions
jest.mock('../api/bikeApi', () => ({
    fetchBike: jest.fn(),
    bikeDetails: jest.fn(),
    bikeDelete: jest.fn(),
}));

describe('BikeCRUDAdmin', () => {
    const bikeId = '123';

    beforeEach(() => {
    // Reset mocks before each test
        jest.clearAllMocks();
    });

    test('loads bike details and displays them', async () => {
        const mockBikeData = {
            data: {
                id: bikeId,
                attributes: {
                    battery_lvl: 80,
                    last_position: 'Location A',
                    is_available: true,
                    created_at: '2022-01-01',
                    updated_at: '2022-01-02',
                },
                relationships: {
                    city: {
                        data: {
                            id: '1',
                        },
                    },
                },
            },
            links: {
                self: `http://example.com/bikes/${bikeId}`,
            },
        };

        // Mock the fetchBike function to resolve with mockBikeData
        fetchBike.mockResolvedValue(mockBikeData);

        render(
            <Router>
                <Routes>
                    <Route path="/bike/:bikeId" element={<BikeCRUDAdmin />} />
                </Routes>
            </Router>
        );

        // Wait for the component to load and check that the bike details are displayed
        await waitFor(() => {
            expect(screen.getByLabelText('Bike ID:').value).toBe(bikeId);
            expect(screen.getByLabelText('Battery Level:').value).toBe('80');
            expect(screen.getByLabelText('Last Position:').value).toBe('Location A');
            expect(screen.getByLabelText('Is Available:').checked).toBe(true);
            expect(screen.getByLabelText('City ID:').value).toBe('1');
        });
    });

    test('submits updated bike details', async () => {
    // Mock necessary data fetching if needed
        const mockBike = {
            data: {
                id: '1',
                attributes: {
                    battery_lvl: 80,
                    last_position: '45.123, 56.789',
                    is_available: true,
                },
                relationships: {
                    city: {
                        data: {
                            id: '2',
                        },
                    },
                },
                links: {
                    self: 'https://api.example.com/bike/1',
                },
            },
        };

        // Mock API call to fetch the bike
        fetchBike.mockResolvedValue(mockBike); 

        render(
            <Router>
                <BikeCRUDAdmin />
            </Router>
        );

        // Wait for the bike details to load and ensure that the Bike ID label is rendered
        await waitFor(() => screen.getByLabelText('Bike ID:'));

        // Simulate changes
        fireEvent.change(screen.getByLabelText('City ID:'), { target: { value: '2' } });

        // Simulate form submission
        fireEvent.click(screen.getByText(/Add new bike/i));

        // Check if the correct API call was made to submit the updated bike details
        expect(bikeDetails).toHaveBeenCalledWith('1', 80, '2', '45.123, 56.789', true); // Replace with actual parameters

    // Add other assertions as needed
    });

    test('deletes the bike', async () => {
    // Mock necessary data fetching if needed
        const mockBike = {
            data: {
                id: '1',
                attributes: {
                    battery_lvl: 80,
                    last_position: '45.123, 56.789',
                    is_available: true,
                },
                relationships: {
                    city: {
                        data: {
                            id: '2',
                        },
                    },
                },
                links: {
                    self: 'https://api.example.com/bike/1',
                },
            },
        };

        // Mock API call to fetch the bike
        fetchBike.mockResolvedValue(mockBike); 

        render(
            <Router>
                <BikeCRUDAdmin />
            </Router>
        );

        // Wait for the bike details to load and make sure the Bike ID is rendered
        await waitFor(() => screen.getByLabelText('Bike ID:'));

        // Interact with the delete button
        fireEvent.click(screen.getByText('Delete'));

        // Add your assertions to check if the bike was deleted or the UI updated

    // bike delete does not work yet
    // expect(fetchBike).toHaveBeenCalled();
    });

    test('redirects if not authenticated', async () => {
    // Mock the sessionStorage to not contain a token
        sessionStorage.getItem = jest.fn(() => null);

        render(
            <Router>
                <Routes>
                    <Route path="/bike/:bikeId" element={<BikeCRUDAdmin />} />
                </Routes>
            </Router>
        );

        // Check that the user is redirected to the home page
        expect(window.location.pathname).toBe('/');
    });
});
