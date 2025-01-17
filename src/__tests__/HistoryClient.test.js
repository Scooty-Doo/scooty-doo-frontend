/* eslint-env jest */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HistoryClient from "../pages/customer/HistoryClient";
import { MemoryRouter } from "react-router-dom";
import { fetchUserTrips } from "../api/userApi";
import "@testing-library/jest-dom";

// Mocka fetchUserTrips
jest.mock("../api/userApi", () => ({
    fetchUserTrips: jest.fn()
}));

describe("HistoryClient Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state", () => {
        render(
            <MemoryRouter>
                <HistoryClient />
            </MemoryRouter>
        );

        expect(screen.getByText("Laddar resor...")).toBeInTheDocument();
    });

    
    

    test("renders error message if fetch fails", async () => {
        fetchUserTrips.mockRejectedValueOnce(new Error("Failed to fetch"));

        render(
            <MemoryRouter>
                <HistoryClient />
            </MemoryRouter>
        );

        // Vänta på att felmeddelandet visas
        await waitFor(() => {
            expect(screen.getByText("Kunde inte hämta resor.")).toBeInTheDocument();
        });
    });
});
