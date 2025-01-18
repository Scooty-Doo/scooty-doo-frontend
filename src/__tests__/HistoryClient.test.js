/* eslint-env jest */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HistoryClient from "../pages/customer/HistoryClient";
import { MemoryRouter } from "react-router-dom";
import { fetchUserTrips } from "../api/meApi";
import "@testing-library/jest-dom";

// Mocka fetchUserTrips
jest.mock("../api/meApi", () => ({
    fetchUserTrips: jest.fn(),
}));

describe("HistoryClient Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mocka sessionStorage
        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });

        // Mocka console.error
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders loading state", () => {
        window.sessionStorage.getItem.mockReturnValue("mock-token");

        render(
            <MemoryRouter>
                <HistoryClient />
            </MemoryRouter>
        );

        expect(screen.getByText("Laddar resor...")).toBeInTheDocument();
    });

    test("renders error message if fetch fails", async () => {
        window.sessionStorage.getItem.mockReturnValue("mock-token");
        fetchUserTrips.mockRejectedValueOnce(new Error("Failed to fetch user: 401"));

        render(
            <MemoryRouter>
                <HistoryClient />
            </MemoryRouter>
        );

        // Vänta på att felmeddelandet visas
        await waitFor(() => {
            expect(screen.getByText("Kunde inte hämta resor.")).toBeInTheDocument();
        });

        // Kontrollera att felet loggas
        expect(console.error).toHaveBeenCalledWith(
            "Error fetching user trips:",
            expect.any(Error)
        );
    });
});
