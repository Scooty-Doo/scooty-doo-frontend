import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CitySelector from '../components/SelectCityAdmin';
import { fetchCities } from '../api/citiesApi';

// Mock the fetchCities API
jest.mock('../api/citiesApi', () => ({
    fetchCities: jest.fn(),
}));

describe('CitySelector Component', () => {
    it('should display a loading message initially', () => {
    // Mock fetchCities to return a resolved promise with no data
        fetchCities.mockResolvedValue({ data: [] });

        render(<CitySelector onCitySelect={jest.fn()} />);

        // Check for the loading message
        expect(screen.getByText(/Loading cities.../i)).toBeInTheDocument();
    });

    it('should render a list of cities once the data is fetched', async () => {
    // Mock the API response with dummy data
        const mockCities = [
            { id: '1', attributes: { city_name: 'City One' } },
            { id: '2', attributes: { city_name: 'City Two' } },
        ];
        fetchCities.mockResolvedValue({ data: mockCities });

        render(<CitySelector onCitySelect={jest.fn()} />);

        // Wait for the cities to be rendered
        await waitFor(() => screen.getByText('City One'));

        // Check if the cities are displayed
        expect(screen.getByText('City One')).toBeInTheDocument();
        expect(screen.getByText('City Two')).toBeInTheDocument();
    });

    it('should call onCitySelect when a city is selected', async () => {
        const mockCities = [
            { id: '1', attributes: { city_name: 'City One' } },
            { id: '2', attributes: { city_name: 'City Two' } },
        ];
        const mockOnCitySelect = jest.fn();
        fetchCities.mockResolvedValue({ data: mockCities });

        render(<CitySelector onCitySelect={mockOnCitySelect} />);

        // Wait for the dropdown options to be rendered
        await waitFor(() => screen.getByText('City One'));

        // Select a city
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

        // Verify the onCitySelect function is called with the correct city data
        expect(mockOnCitySelect).toHaveBeenCalledWith({
            id: '1',
            attributes: { city_name: 'City One' },
        });
    });

    it('should display the selected city ID after selecting a city', async () => {
        const mockCities = [
            { id: '1', attributes: { city_name: 'City One' } },
            { id: '2', attributes: { city_name: 'City Two' } },
        ];
        fetchCities.mockResolvedValue({ data: mockCities });

        render(<CitySelector onCitySelect={jest.fn()} />);

        // Wait for the cities to be rendered
        await waitFor(() => screen.getByText('City One'));

        // Select a city
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

        // Check if the selected city ID is displayed
        expect(screen.getByText('You selected city ID: 1')).toBeInTheDocument();
    });
});
