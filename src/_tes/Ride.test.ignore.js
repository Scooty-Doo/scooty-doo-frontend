/* istanbul ignore file */
/* eslint-env jest */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Ridehistory from "../pages/customer/Ride";
import { fillWallet } from "../api/stripeApi";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("../api/stripeApi", () => ({
    fillWallet: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

describe("Ridehistory Component", () => {
    const mockRideHistory = {
        data: {
            attributes: {
                total_fee: 25.5,
                path_taken: "LINESTRING(13.06782 55.57786,13.10005 55.55034)",
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.setItem("token", "test-token");

        const mockLocation = {
            state: { ride: mockRideHistory },
        };

        require("react-router-dom").useLocation.mockReturnValue(mockLocation);
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    test("renders the Ridehistory component with ride details", () => {
        render(
            <MemoryRouter>
                <Ridehistory />
            </MemoryRouter>
        );

        expect(screen.getByText("Din resa")).toBeInTheDocument();
        expect(screen.getByText("Betala din resa nu")).toBeInTheDocument();
        expect(screen.getByText("Mocked RideDetails")).toBeInTheDocument();
        expect(screen.getByText("Mocked MapRide")).toBeInTheDocument();
    });

    test("redirects to login if token is missing", () => {
        sessionStorage.removeItem("token");

        const mockNavigate = jest.fn();
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <Ridehistory />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("calls fillWallet API on button click and redirects", async () => {
        fillWallet.mockResolvedValueOnce({
            data: { url: "http://test-payment-url.com" },
        });

        const originalLocation = window.location;
        delete window.location;
        window.location = { assign: jest.fn() };

        render(
            <MemoryRouter>
                <Ridehistory />
            </MemoryRouter>
        );

        const payButton = screen.getByText("Betala din resa nu");
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(fillWallet).toHaveBeenCalledWith(26, expect.any(String)); // Rounded amount
            expect(window.location.assign).toHaveBeenCalledWith("http://test-payment-url.com");
        });

        window.location = originalLocation;
    });

    test("handles API error when filling wallet", async () => {
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

        fillWallet.mockRejectedValueOnce(new Error("Failed to process payment"));

        render(
            <MemoryRouter>
                <Ridehistory />
            </MemoryRouter>
        );

        const payButton = screen.getByText("Betala din resa nu");
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to add to wallet. Please try again. Details",
                expect.any(Error)
            );
        });

        consoleErrorMock.mockRestore();
    });
});
