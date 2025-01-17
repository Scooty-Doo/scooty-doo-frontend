/* eslint-env jest */
import React from "react";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import AccountClient from "../pages/customer/AccountClient";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { fetchUser, userDetails } from "../api/meApi";

// Mocka API
jest.mock("../api/meApi", () => ({
    fetchUser: jest.fn(),
    userDetails: jest.fn()
}));

describe("AccountClient Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Rensa mocks inför varje test
        fetchUser.mockResolvedValue({
            data: {
                attributes: {
                    full_name: "ScootyPrepaidson",
                    email: "scooty@doot.com",
                    use_prepay: "true",
                    balance: 39.99
                }
            }
        });
    });

    test("renders the AccountClient and displays the user info", async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AccountClient />
                </MemoryRouter>
            );
        });
    
        // Kontrollera användarnamn och e-post
        expect(screen.getByDisplayValue("ScootyPrepaidson")).toBeInTheDocument();
        expect(screen.getByDisplayValue("scooty@doot.com")).toBeInTheDocument();
    
        // Kontrollera balansvisning med en flexibel matcherfunktion
        const balanceText = screen.getByText((content, element) => {
            return (
                element.tagName.toLowerCase() === "p" &&
                content.includes("39.99") &&
                content.includes(":-")
            );
        });
    
        expect(balanceText).toBeInTheDocument();
    });
    

    test("handles API error and shows alert", async () => {
        fetchUser.mockRejectedValueOnce(new Error("API Error"));

        jest.spyOn(window, "alert").mockImplementation(() => {});

        await act(async () => {
            render(
                <MemoryRouter>
                    <AccountClient />
                </MemoryRouter>
            );
        });

        expect(window.alert).toHaveBeenCalledWith("Kunde inte hämta användarinformation.");
    });

    test("allows user to change name and email and submit form", async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AccountClient />
                </MemoryRouter>
            );
        });

        const nameInput = screen.getByDisplayValue("ScootyPrepaidson");
        const emailInput = screen.getByDisplayValue("scooty@doot.com");
        const saveButton = screen.getByRole("button", { name: "Spara ändringar" });

        // Ändra användarinformation
        fireEvent.change(nameInput, { target: { value: "NyPrepaidson" } });
        fireEvent.change(emailInput, { target: { value: "ny@prepaid.com" } });

        // Skicka formuläret
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(userDetails).toHaveBeenCalledWith(
                "NyPrepaidson",
                "ny@prepaid.com",
                "true"
            );
            expect(window.alert).toHaveBeenCalledWith("Dina ändringar har sparats!");
        });
    });

    test("handles form submission failure", async () => {
        userDetails.mockRejectedValueOnce(new Error("Failed to update"));

        jest.spyOn(window, "alert").mockImplementation(() => {});

        await act(async () => {
            render(
                <MemoryRouter>
                    <AccountClient />
                </MemoryRouter>
            );
        });

        const saveButton = screen.getByRole("button", { name: "Spara ändringar" });

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Kunde inte spara ändringar.");
        });
    });

    test("changes payment method using select input", async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AccountClient />
                </MemoryRouter>
            );
        });

        const selectInput = screen.getByLabelText("Välj betalningsmetod:");

        fireEvent.change(selectInput, { target: { value: "false" } });

        expect(selectInput.value).toBe("false");
    });
});
