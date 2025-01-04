/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import RideDetails from '../components/RideDetails'; // Sökväg till din komponent

// Mocka formatTime-funktionen för att förenkla testet
const mockFormatTime = jest.fn().mockReturnValue('12:00'); 

describe('RideDetails', () => {
    // Mockad rideHistory för att representera en resa
    const mockRideHistory = {
        data: {
            attributes: {
                start_time: '2024-12-23T10:00:00',
                end_time: '2024-12-23T12:00:00',
                total_fee: 150,
            },
        },
    };

    test('renderar rätt information om resan', () => {
        render(<RideDetails rideHistory={mockRideHistory} formatTime={mockFormatTime} />);
  
        // Kontrollera om start- och sluttider visas korrekt med en flexibel textmatchning
        expect(screen.getByText((content, element) => 
            element.textContent.includes('12/23/2024') && 
      element.textContent.includes('12:00 - 12:00')
        )).toBeInTheDocument();
  
        // Kontrollera om priset visas korrekt
        expect(screen.getByText('Pris:')).toBeInTheDocument();
        expect(screen.getByText('150 kr')).toBeInTheDocument();
  
        // Kontrollera att formatTime anropas korrekt
        expect(mockFormatTime).toHaveBeenCalledWith('2024-12-23T10:00:00');
        expect(mockFormatTime).toHaveBeenCalledWith('2024-12-23T12:00:00');
    });
});
