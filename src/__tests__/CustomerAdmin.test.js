import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Customer from '../pages/admin/CustomerAdmin';
import * as userApi from '../api/userApi';
import TripsList from '../components/TripsList';

// Mocking the API calls
jest.mock('../api/userApi', () => ({
    fetchUser: jest.fn(),
    fetchUserTrips: jest.fn(),
    userDetails2: jest.fn(),
}));

describe('Customer Component', () => {
    const mockCustomer = {
        data: {
            attributes: {
                full_name: 'John Doe',
                email: 'johndoe@example.com',
                github_login: 'johnny',
                balance: 100,
                created_at: '2021-01-01',
                updated_at: '2021-01-02',
                use_prepay: true,
            },
            links: {
                self: 'https://github.com/johndoe',
            },
        },
    };

    const mockTrips = {
        data: [
            {
                id: 1,
                attributes: {
                    start_position: 'Start City',
                    end_position: 'End City',
                    start_time: '2025-01-01T10:00:00',
                    end_time: '2025-01-01T12:00:00',
                    time_fee: 10,
                    total_fee: 20,
                },
                links: {
                    self: 'http://127.0.0.1:8000/v1/users/652134919185249800/trips62',
                },
            },
            {
                id: 2,
                attributes: {
                    start_position: 'Another City',
                    end_position: 'Final City',
                    start_time: '2025-01-02T14:00:00',
                    end_time: '2025-01-02T16:00:00',
                    time_fee: 15,
                    total_fee: 69,
                },
                links: {
                    self: 'http://example.com/trip/2',
                },
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        userApi.fetchUser.mockResolvedValueOnce(null); // Simulate loading state
        render(<Customer />);
        await waitFor(() => expect(screen.getByText('Loading user data...')).toBeInTheDocument());
    });
  

    it('renders customer data correctly after loading', async () => {
        userApi.fetchUser.mockResolvedValueOnce(mockCustomer);
        userApi.fetchUserTrips.mockResolvedValueOnce(mockTrips);
    
        render(<Customer />);

        // Wait for the customer data to load
        await waitFor(() => expect(screen.getByDisplayValue(mockCustomer.data.attributes.full_name)).toBeInTheDocument());
    
        // Check for customer details
        expect(screen.getByDisplayValue(mockCustomer.data.attributes.email)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockCustomer.data.attributes.balance.toString())).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockCustomer.data.attributes.created_at)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockCustomer.data.attributes.updated_at)).toBeInTheDocument();
    });

    test('renders a list of trips', () => {
        render(<TripsList trips={mockTrips} />);
    
        // Ensure the table is rendered with headers
        expect(screen.getByText(/Trips List/)).toBeInTheDocument();
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByText(/start_position/)).toBeInTheDocument();
        expect(screen.getByText(/end_position/)).toBeInTheDocument();
    
        // Verify that the trips are listed
        expect(screen.getByText(/Start City/)).toBeInTheDocument();  // start_position
        expect(screen.getByText(/End City/)).toBeInTheDocument();  // end_position
        expect(screen.getByText(/2025-01-01T10:00:00/)).toBeInTheDocument();  // start_time
        expect(screen.getByText(/2025-01-02T16:00:00/)).toBeInTheDocument();  // end_time
    
        // Check the fees
        expect(screen.getByText(/15/)).toBeInTheDocument();  // time_fee
        expect(screen.getByText(/69/)).toBeInTheDocument();  // total_fee
    
        expect(screen.getByText(/http:\/\/127.0.0.1:8000\/v1\/users\/652134919185249800\/trips62/)).toBeInTheDocument();  // link
  
        // Ensure the second trip also shows up (if it's in mockTrips)
        expect(screen.getByText(/Another City/)).toBeInTheDocument(); // Update to actual second trip details if needed
    });
  
  

    test('renders "No trips available" when no trips are passed', () => {
        render(<TripsList trips={{ data: [] }} />);
    
        // Expect "No trips available" to be shown
        expect(screen.getByText(/No trips available/)).toBeInTheDocument();
    });
  

    it('should submit updated customer data correctly', async () => {
        userApi.fetchUser.mockResolvedValueOnce(mockCustomer);
        userApi.fetchUserTrips.mockResolvedValueOnce(mockTrips);
        userApi.userDetails2.mockResolvedValueOnce(true); // Mock successful submission

        render(<Customer />);

        await waitFor(() => expect(screen.getByDisplayValue(mockCustomer.data.attributes.full_name)).toBeInTheDocument());

        // Simulate a change in the full name
        fireEvent.change(screen.getByLabelText('Full Name'), {
            target: { value: 'Jane Doe' },
        });

        // Simulate form submission
        fireEvent.click(screen.getByText('Submit'));

        // Check that userDetails2 API call was made with updated data
        await waitFor(() => expect(userApi.userDetails2).toHaveBeenCalledWith(
            expect.any(BigInt),
            'Jane Doe',
            mockCustomer.data.attributes.email,
            mockCustomer.data.attributes.github_login,
            mockCustomer.data.attributes.use_prepay
        ));
    });

    it('should handle error if submission fails', async () => {
    // Mock the console.log to track the calls
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        // Mock the userDetails2 function to simulate an error
        userApi.fetchUser.mockResolvedValueOnce(mockCustomer);
        userApi.fetchUserTrips.mockResolvedValueOnce(mockTrips);
        userApi.userDetails2.mockRejectedValueOnce(new Error('Error submitting customer data'));

        render(<Customer />);

        await waitFor(() => expect(screen.getByDisplayValue(mockCustomer.data.attributes.full_name)).toBeInTheDocument());

        fireEvent.click(screen.getByText('Submit'));

        // Check that error message was logged
        await waitFor(() => expect(consoleLogSpy).toHaveBeenCalledWith('Error submitting customer data:', expect.any(Error)));

        // Clean up the spy
        consoleLogSpy.mockRestore();
    });
});
