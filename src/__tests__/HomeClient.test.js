/* eslint-env jest */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeClient from "../pages/customer/HomeClient";
import { startRide, endRide } from "../api/tripsApi";
import { fetchUser } from "../api/meApi";
import "@testing-library/jest-dom";

// Mock API calls
jest.mock("../api/tripsApi", () => ({
    startRide: jest.fn(),
    endRide: jest.fn(),
}));

jest.mock("../api/meApi", () => ({
    fetchUser: jest.fn(),
}));

jest.mock("../components/Map", () => {
    return jest.fn(() => <div data-testid="map-view">Mocked MapView</div>);
});

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("HomeClient Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });

        jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert
        jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error

        window.sessionStorage.getItem.mockReturnValue("test-token");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("redirects to login if token is missing", () => {
        window.sessionStorage.getItem.mockReturnValueOnce(null);

        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("fetches and displays user info", async () => {
        fetchUser.mockResolvedValueOnce({
            data: {
                attributes: {
                    full_name: "Test User",
                    email: "test@example.com",
                    use_prepay: true,
                    balance: 50,
                },
            },
        });

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Starta din resa")).toBeInTheDocument();
        });
    });

    test("handles invalid user data gracefully", async () => {
        fetchUser.mockResolvedValueOnce(null); // Returnerar null istället för giltig data

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Kunde inte hämta användarinformation.");
        });
    });

    test("handles API error gracefully when fetching user info", async () => {
        fetchUser.mockRejectedValueOnce(new Error("API Error"));

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Kunde inte hämta användarinformation.");
        });
    });

    test("starts a ride successfully", async () => {
        const mockTrip = { data: { id: "trip123" } };
        startRide.mockResolvedValueOnce(mockTrip);

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Ange cykelns ID"), {
            target: { value: "bike123" },
        });

        fireEvent.submit(screen.getByRole("form", { name: /trip-form/i }));

        await waitFor(() => {
            expect(startRide).toHaveBeenCalledWith("bike123");
            expect(screen.getByText("Resa igång")).toBeInTheDocument();
        });
    });

    test("ends a ride successfully", async () => {
        const mockRide = { data: { id: "trip123" } };
        startRide.mockResolvedValueOnce(mockRide);
        endRide.mockResolvedValueOnce(mockRide);

        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Ange cykelns ID"), {
            target: { value: "bike123" },
        });

        fireEvent.submit(screen.getByRole("form", { name: /trip-form/i }));

        await waitFor(() => {
            expect(screen.getByText("Resa igång")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Avsluta resa"));

        await waitFor(() => {
            expect(endRide).toHaveBeenCalledWith("trip123", "bike123");
            expect(mockNavigate).toHaveBeenCalledWith("/ridehistory/", { state: { ride: mockRide } });
        });
    });
});
