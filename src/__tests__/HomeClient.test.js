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

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("HomeClient Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.setItem("token", "test-token");
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    test("redirects to login if token is missing", () => {
        sessionStorage.removeItem("token");

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
        const mockUser = {
            data: {
                attributes: {
                    full_name: "Test User",
                    email: "test@example.com",
                    use_prepay: true,
                    balance: 50,
                },
            },
        };

        fetchUser.mockResolvedValueOnce(mockUser);

        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Starta din resa")).toBeInTheDocument();
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
        });
    });
    

    test("redirects to account if wallet balance is negative", async () => {
        const mockUser = {
            data: {
                attributes: {
                    full_name: "Test User",
                    email: "test@example.com",
                    use_prepay: true,
                    balance: -10,
                },
            },
        };
    
        const mockNavigate = jest.fn();
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    
        fetchUser.mockResolvedValueOnce(mockUser);
    
        render(
            <MemoryRouter>
                <HomeClient />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByText("Fyll på ditt saldo innan du kan starta resa")).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByText("Fyll på ditt saldo innan du kan starta resa"));
    
        expect(mockNavigate).toHaveBeenCalledWith("/accountclient");
    });
});
