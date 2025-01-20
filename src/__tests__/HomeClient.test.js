/* eslint-env jest */
import React from "react";
import { render} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeClient from "../pages/customer/HomeClient";
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
    return jest.fn(({ onBikeClick, onCitySelect }) => (
        <div data-testid="map-view">
            <div data-testid="city-selector-container">
                <select data-testid="city-selector" onChange={(e) => onCitySelect(e.target.value)}>
                    <option value="">Välj en stad...</option>
                    <option value="1">Göteborg</option>
                    <option value="2">Stockholm</option>
                    <option value="3">Malmö</option>
                </select>
            </div>
            <button onClick={() => onBikeClick("bike123")}>Välj cykel</button>
        </div>
    ));
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
});
