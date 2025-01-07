/* eslint-env jest */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Ridehistory from "../pages/customer/Ride";
import { fetchRide } from "../api/tripsApi";
import "@testing-library/jest-dom";

// Mocka API och komponenter
jest.mock("../api/tripsApi", () => ({
    fetchRide: jest.fn()
}));

jest.mock("../components/MapRide", () => {
    const MockMapRide = () => <div>Mocked MapRide</div>;
    MockMapRide.displayName = "MockMapRide";
    return MockMapRide;
});

jest.mock("../components/RideDetails", () => {
    const MockRideDetails = () => <div>Mocked RideDetails</div>;
    MockRideDetails.displayName = "MockRideDetails";
    return MockRideDetails;
});

describe("Ridehistory Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state initially", async () => {
        // Säkerställ att mocken returnerar ett Promise
        fetchRide.mockResolvedValueOnce({ data: { attributes: {} } });
    
        render(
            <MemoryRouter initialEntries={["/ridehistory/1"]}>
                <Routes>
                    <Route path="/ridehistory/:tripId" element={<Ridehistory />} />
                </Routes>
            </MemoryRouter>
        );
    
        // Kontrollera att vi ser laddningsmeddelandet under fetch
        expect(screen.getByText("Laddar resa...")).toBeInTheDocument();
    
        // Vänta på att API-anropet slutförs
        await waitFor(() => {
            expect(fetchRide).toHaveBeenCalledWith("1");
        });
    });
    

    test("renders ride details after fetching ride data", async () => {
        const mockRideData = {
            data: {
                attributes: {
                    path_taken: "LINESTRING(12.9715987 77.5945627,12.2958104 76.6393805)",
                    start_time: "2024-01-01T10:00:00Z",
                    end_time: "2024-01-01T11:00:00Z",
                    total_fee: 100
                }
            }
        };

        fetchRide.mockResolvedValueOnce(mockRideData);

        render(
            <MemoryRouter initialEntries={["/ridehistory/1"]}>
                <Routes>
                    <Route path="/ridehistory/:tripId" element={<Ridehistory />} />
                </Routes>
            </MemoryRouter>
        );

        // Vänta på att API-anropet ska slutföras och komponenten ska uppdateras
        await waitFor(() => {
            expect(screen.getByText("Din resa")).toBeInTheDocument();
        });

        // Kontrollera att `RideDetails` och `MapRide` renderas
        expect(screen.getByText("Mocked RideDetails")).toBeInTheDocument();
        expect(screen.getByText("Mocked MapRide")).toBeInTheDocument();

        // Kontrollera att knappen för att boka ny cykel visas
        expect(screen.getByText("Boka en ny cykel")).toBeInTheDocument();
    });

});
