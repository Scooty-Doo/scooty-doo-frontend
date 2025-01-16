import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AccountAdmin from '../pages/admin/AccountAdmin';

describe('AccountAdmin Component', () => {
    beforeEach(() => {
        // Mocking the alert function to avoid actual popups during testing
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders form correctly with default values', () => {
        render(<AccountAdmin />);

        expect(screen.getByLabelText(/Användarnamn/).value).toBe('Tim Lundqvist');
        expect(screen.getByLabelText(/E-postadress/).value).toBe('tim@mail.com');
        expect(screen.getByLabelText(/Telefonnummer/).value).toBe('0725558468');
        expect(screen.getByLabelText(/Nytt lösenord/).value).toBe('');
        expect(screen.getByLabelText(/Bekräfta lösenord/).value).toBe('');
    });

    it('validates form fields and shows errors on invalid input', async () => {
        render(<AccountAdmin />);

        fireEvent.change(screen.getByLabelText(/Användarnamn/), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/E-postadress/), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Telefonnummer/), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Nytt lösenord/), { target: { value: '12345' } });
        fireEvent.change(screen.getByLabelText(/Bekräfta lösenord/), { target: { value: '54321' } });

        fireEvent.click(screen.getByText(/Spara ändringar/));

        await waitFor(() => {
            expect(screen.getByText('Användarnamn krävs')).toBeInTheDocument();
            expect(screen.getByText('E-postadress krävs')).toBeInTheDocument();
            expect(screen.getByText('Telefonnummer krävs')).toBeInTheDocument();
            expect(screen.getByText('Lösenorden matchar inte')).toBeInTheDocument();
        });
    });

    it('submits form successfully with valid data', async () => {
        render(<AccountAdmin />);

        fireEvent.change(screen.getByLabelText(/Användarnamn/), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/E-postadress/), { target: { value: 'john@mail.com' } });
        fireEvent.change(screen.getByLabelText(/Telefonnummer/), { target: { value: '0721234567' } });
        fireEvent.change(screen.getByLabelText(/Nytt lösenord/), { target: { value: 'newPassword123' } });
        fireEvent.change(screen.getByLabelText(/Bekräfta lösenord/), { target: { value: 'newPassword123' } });

        fireEvent.click(screen.getByText(/Spara ändringar/));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Ändringar sparade!');
        });
    });

    it('displays error message for invalid email format', async () => {
        render(<AccountAdmin />);

        fireEvent.change(screen.getByLabelText(/E-postadress/), { target: { value: 'invalid-email' } });

        fireEvent.click(screen.getByText(/Spara ändringar/));

        await waitFor(() => {
            expect(screen.getByText('Ogiltig e-postadress')).toBeInTheDocument();
        });
    });

    it('does not show error messages if fields are filled correctly', async () => {
        render(<AccountAdmin />);

        fireEvent.change(screen.getByLabelText(/Användarnamn/), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/E-postadress/), { target: { value: 'alice@mail.com' } });
        fireEvent.change(screen.getByLabelText(/Telefonnummer/), { target: { value: '0729876543' } });
        fireEvent.change(screen.getByLabelText(/Nytt lösenord/), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Bekräfta lösenord/), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText(/Spara ändringar/));

        await waitFor(() => {
            expect(screen.queryByText('Användarnamn krävs')).not.toBeInTheDocument();
            expect(screen.queryByText('E-postadress krävs')).not.toBeInTheDocument();
            expect(screen.queryByText('Telefonnummer krävs')).not.toBeInTheDocument();
            expect(screen.queryByText('Lösenorden matchar inte')).not.toBeInTheDocument();
        });
    });
});
