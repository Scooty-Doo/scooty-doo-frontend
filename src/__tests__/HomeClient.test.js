/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeClient from '../pages/customer/HomeClient';
import { startRide, endRide } from '../api/tripsApi';

// Mocka API
jest.mock('../api/tripsApi', () => ({
    startRide: jest.fn(),
    endRide: jest.fn(),
}));

// Mocka karta
jest.mock('../components/Map.js', () => {
    const MockMap = () => <div>Mocked MapView</div>;
    MockMap.displayName = 'MockMap';
    return MockMap;
});

describe('HomeClient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', () => {
        render(
            <Router>
                <HomeClient />
            </Router>
        );
        expect(screen.getByText('Starta din resa')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ange cykelns ID')).toBeInTheDocument();
    });

    test('start a trip', async () => {
        startRide.mockResolvedValue({ data: { id: 'mockTripId' } });
  
        render(
            <Router>
                <HomeClient />
            </Router>
        );
  
        // Skriv in cykelns ID och skicka formuläret
        fireEvent.change(screen.getByPlaceholderText('Ange cykelns ID'), {
            target: { value: '2' },
        });
  
        // Hitta och skicka formuläret
        const form = screen.getByRole('form', { name: /trip-form/i });
        fireEvent.submit(form);
  
        // Vänta på att resan ska vara igång
        await waitFor(() => screen.getByText('Resa igång'));
  
        // Kontrollera att API-anropet görs
        await waitFor(() => {
            expect(startRide).toHaveBeenCalledWith('1', '2');
        });
  
        // Kontrollera att resan är igång
        expect(screen.getByText('Resa igång')).toBeInTheDocument();
    });

    test('end a trip', async () => {
    // Mocka API-anropen
        endRide.mockResolvedValue({ data: { id: 'mockTripId' } });
        startRide.mockResolvedValue({ data: { id: 'mockTripId' } });
  
        render(
            <Router>
                <HomeClient />
            </Router>
        );
  
        // Skriv in cykelns ID och skicka formuläret för att starta resan
        fireEvent.change(screen.getByPlaceholderText('Ange cykelns ID'), {
            target: { value: '2' },
        });
  
        // Hitta och skicka formuläret
        const form = screen.getByRole('form', { name: /trip-form/i });
        fireEvent.submit(form);
  
        // Vänta på att resan ska vara igång
        await waitFor(() => screen.getByText('Resa igång'));
  
        // Kontrollera att API-anropet för att starta resan görs
        await waitFor(() => {
            expect(startRide).toHaveBeenCalledWith('1', '2');
        });
  
        // Kontrollera att resan är igång
        expect(screen.getByText('Resa igång')).toBeInTheDocument();
  
        // Klicka på knappen för att avsluta resan
        fireEvent.click(screen.getByText('Avsluta resa'));
  
        // Kontrollera att API-anropet för att avsluta resan görs
        await waitFor(() => {
            expect(endRide).toHaveBeenCalledWith('mockTripId', '1', '2');
        });
  
    });
  
  
});
