/* eslint-env jest */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountAdmin from "../pages/admin/AccountAdmin";
import "@testing-library/jest-dom";

describe("AccountAdmin Component", () => {
    test("renders the form with default values", () => {
        render(<AccountAdmin />);

        expect(screen.getByLabelText(/Användarnamn:/i)).toHaveValue("Tim Lundqvist");
        expect(screen.getByLabelText(/E-postadress:/i)).toHaveValue("tim@mail.com");
        expect(screen.getByLabelText(/Telefonnummer:/i)).toHaveValue("0725558468");
    });

    test("shows validation errors for empty fields on submit", () => {
        render(<AccountAdmin />);

        // Tömma fält
        fireEvent.change(screen.getByLabelText(/Användarnamn:/i), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText(/E-postadress:/i), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText(/Telefonnummer:/i), { target: { value: "" } });

        fireEvent.click(screen.getByRole("button", { name: /Spara ändringar/i }));

        expect(screen.getByText(/Användarnamn krävs/i)).toBeInTheDocument();
        expect(screen.getByText(/E-postadress krävs/i)).toBeInTheDocument();
        expect(screen.getByText(/Telefonnummer krävs/i)).toBeInTheDocument();
    });

    test("shows validation error for invalid email", () => {
        render(<AccountAdmin />);

        fireEvent.change(screen.getByLabelText(/E-postadress:/i), { target: { value: "invalidemail" } });

        fireEvent.click(screen.getByRole("button", { name: /Spara ändringar/i }));

        expect(screen.getByText(/Ogiltig e-postadress/i)).toBeInTheDocument();
    });

    test("submits the form when all fields are valid", () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

        render(<AccountAdmin />);

        fireEvent.change(screen.getByLabelText(/Användarnamn:/i), { target: { value: "Ny Admin" } });
        fireEvent.change(screen.getByLabelText(/E-postadress:/i), { target: { value: "newadmin@mail.com" } });
        fireEvent.change(screen.getByLabelText(/Telefonnummer:/i), { target: { value: "0701234567" } });

        fireEvent.click(screen.getByRole("button", { name: /Spara ändringar/i }));

        expect(alertMock).toHaveBeenCalledWith("Ändringar sparade!");

        alertMock.mockRestore();
    });
});
