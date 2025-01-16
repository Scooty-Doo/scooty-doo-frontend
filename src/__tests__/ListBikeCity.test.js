/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ListBikeCity from '../components/ListBikeCity';
import { fetchBikeByCityApi, fetchBike } from '../api/bikeApi';

// Mock the API function
jest.mock('../api/bikeApi', () => ({
    fetchBikeByCityApi: jest.fn(),
    fetchBike: jest.fn(),
  }));

describe('ListBikeCity Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('renders correctly with input fields and buttons', () => {
        render(<ListBikeCity />);

        expect(screen.getByPlaceholderText('Enter City ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Bike ID')).toBeInTheDocument();
        expect(screen.getByText('Search by City ID')).toBeInTheDocument();
        expect(screen.getByText('Search by Bike ID')).toBeInTheDocument();
    });

    test('fetches bikes by city ID and displays them', async () => {
        const mockData = {
            data: [
                {
                    id: '1',
                    attributes: {
                        battery_lvl: 80,
                        last_position: 'Position A',
                        is_available: true,
                        created_at: '2025-01-15T10:00:00Z',
                        updated_at: '2025-01-16T10:00:00Z',
                    },
                    relationships: {
                        city: { data: { id: '2' } },
                    },
                },
            ],
        };
    
        fetchBikeByCityApi.mockResolvedValueOnce(mockData);
    
        render(
            <Router>   {/* Wrap the component with Router in the test */}
                <ListBikeCity />
            </Router>
        );
    
        const cityInput = screen.getByPlaceholderText('Enter City ID');
        const citySearchButton = screen.getByText('Search by City ID');
    
        fireEvent.change(cityInput, { target: { value: '2' } });
        fireEvent.click(citySearchButton);
    
        expect(fetchBikeByCityApi).toHaveBeenCalledWith('2');
    
        await waitFor(() => {
            expect(screen.getByText('80%')).toBeInTheDocument();
            expect(screen.getByText('Position A')).toBeInTheDocument();
        });
    });

    test('fetches bike by bike ID and displays it', async () => {
        const mockData = {
            data: {
                id: '1',
                attributes: {
                    battery_lvl: 70,
                    last_position: 'Position B',
                    is_available: false,
                    created_at: '2025-01-15T10:00:00Z',
                    updated_at: '2025-01-16T10:00:00Z',
                },
                relationships: {
                    city: { data: { id: '456' } },
                },
            },
        };
    
        fetchBike.mockResolvedValueOnce(mockData); // Now this will work
    
        render(
            <Router>   {/* Wrap the component with Router in the test */}
                <ListBikeCity />
            </Router>
        );
    
        const bikeInput = screen.getByPlaceholderText('Enter Bike ID');
        const bikeSearchButton = screen.getByText('Search by Bike ID');
    
        fireEvent.change(bikeInput, { target: { value: '1' } });
        fireEvent.click(bikeSearchButton);
    
        expect(fetchBike).toHaveBeenCalledWith('1');
        await waitFor(() => {
            expect(screen.getByText('70%')).toBeInTheDocument();
            expect(screen.getByText('Position B')).toBeInTheDocument();
        });
    });

    test('shows loading text while fetching data', async () => {
        fetchBikeByCityApi.mockImplementation(() => new Promise(() => {})); // Simulate loading state

        render(<ListBikeCity />);

        const cityInput = screen.getByPlaceholderText('Enter City ID');
        const citySearchButton = screen.getByText('Search by City ID');

        fireEvent.change(cityInput, { target: { value: '123' } });
        fireEvent.click(citySearchButton);

        expect(screen.getByText('Loading bikes...')).toBeInTheDocument();
    });

    test('handles API errors gracefully', async () => {
        fetchBikeByCityApi.mockRejectedValueOnce(new Error('Failed to fetch data'));

        render(<ListBikeCity />);

        const cityInput = screen.getByPlaceholderText('Enter City ID');
        const citySearchButton = screen.getByText('Search by City ID');

        fireEvent.change(cityInput, { target: { value: '123' } });
        fireEvent.click(citySearchButton);

        await waitFor(() => {
            expect(screen.getByText(/Error loading bikes:/i)).toBeInTheDocument();
        });
    });
});
