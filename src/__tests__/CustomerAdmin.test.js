import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Customer from '../pages/admin/CustomerAdmin';
import { fetchCustomer } from '../api/customerApi';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock API
jest.mock('../api/customerApi', () => ({
    fetchCustomer: jest.fn(),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Customer Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('navigates to customer update page when a row is clicked', async () => {
        const mockSearchResults = {
            data: [
                {
                    id: 1,
                    attributes: {
                        full_name: 'John Doe',
                        email: 'johndoe@example.com',
                        github_login: 'johndoe',
                        balance: 50,
                        use_prepay: true,
                        created_at: '2023-01-01T10:00:00Z',
                        updated_at: '2023-01-02T12:00:00Z',
                    },
                },
            ],
        };

        fetchCustomer.mockResolvedValueOnce(mockSearchResults);

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <Customer />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Search/i }));

        await waitFor(() => {
            fireEvent.click(screen.getByText('John Doe'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/customerupdate/1');
    });
});
