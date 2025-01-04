/* eslint-env jest */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import AccountClient from "../pages/customer/AccountClient";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { fetchUser } from "../api/userApi";

// Mocka API
jest.mock('../api/userApi', () => ({
    fetchUser: jest.fn(),
    userDetails: jest.fn()
}));

describe("AccountClient", () => {
    beforeEach(() => {
        // Mocka user
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

        expect(screen.getByDisplayValue("ScootyPrepaidson")).toBeInTheDocument();
        expect(screen.getByDisplayValue("scooty@doot.com")).toBeInTheDocument();

        // Hitta texten "39,99 :-" även om den är uppdelad
        const balanceText = screen.getByText((content, element) => {
            return content.includes("39.99") && element.textContent.includes(":-");
        });

    expect(balanceText).toBeInTheDocument();
    });
});
