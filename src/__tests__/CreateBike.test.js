import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateBike from '../components/CreateBike';
// Mock the fetch function globally
global.fetch = jest.fn();

describe('CreateBike Component', () => {
    beforeEach(() => {
        // Mock console.error to catch error logs in the test
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('displays error if API request fails', async () => {
        // Mock fetch to simulate a failed API call
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({}),
        });

        render(<CreateBike />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Battery Level/), {
            target: { value: '80' },
        });
        fireEvent.change(screen.getByLabelText(/Last Position/), {
            target: { value: 'Downtown' },
        });
        fireEvent.change(screen.getByLabelText(/City ID/), {
            target: { value: '123' },
        });
        fireEvent.click(screen.getByText(/Add new bike/));

        // Wait for the error to be captured
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                'Error submitting bike data:',
                expect.any(Error)
            );
        });
    });

    it('submits bike data successfully', async () => {
        // Mock fetch to simulate a successful API call
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        });

        render(<CreateBike />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Battery Level/), {
            target: { value: '80' },
        });
        fireEvent.change(screen.getByLabelText(/Last Position/), {
            target: { value: 'Downtown' },
        });
        fireEvent.change(screen.getByLabelText(/City ID/), {
            target: { value: '123' },
        });
        fireEvent.click(screen.getByText(/Add new bike/));

        // Check if the API was called correctly
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8000/v1/bikes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    battery_lvl: '80',
                    city_id: '123',
                    last_position: 'Downtown',
                    is_available: false,
                    meta_data: {},
                }),
            });
        });
    });
});
