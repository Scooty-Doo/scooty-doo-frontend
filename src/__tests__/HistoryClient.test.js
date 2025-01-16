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

    test("renders user trips", async () => {
        const mockTrips = {
            data: [
                {
                    id: 1,
                    attributes: {
                        start_time: "2024-01-01T10:00:00Z",
                        end_time: "2024-01-01T11:00:00Z",
                        total_fee: 79
                    }
                },
                {
                    id: 2,
                    attributes: {
                        start_time: "2024-01-02T14:30:00Z",
                        end_time: "2024-01-02T15:00:00Z",
                        total_fee: 99
                    }
                }
            ]
        };
    
        fetchUserTrips.mockResolvedValueOnce(mockTrips);
    
        render(
            <MemoryRouter>
                <HistoryClient />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByText("Historik")).toBeInTheDocument();
        });
    
        expect(screen.getByText("10:00 AM - 11:00 AM")).toBeInTheDocument();
        expect(screen.getByText("79 kr")).toBeInTheDocument();
        expect(screen.getByText("02:30 PM - 03:00 PM")).toBeInTheDocument();
        expect(screen.getByText("99 kr")).toBeInTheDocument();
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
