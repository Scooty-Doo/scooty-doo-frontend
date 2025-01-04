/* eslint-env jest */
import { startRide, endRide, fetchRide } from "../api/tripsApi";
import fetchMock from "jest-fetch-mock";

// Aktivera fetchMock
fetchMock.enableMocks();

describe("tripsApi functions", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("startRide successfully starts a ride", async () => {
        const mockResponse = {
            message: "Ride started successfully",
            trip_id: 123
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await startRide(1, 42);

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/trips/",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    user_id: 1,
                    bike_id: 42,
                }),
                headers: { "Content-Type": "application/json" },
            })
        );

        expect(response).toEqual(mockResponse);
    });

    test("startRide handles errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 400 });

        await expect(startRide(1, 42)).rejects.toThrow("Failed to start ride: 400");
    });

    // Test för endRide
    test("endRide successfully ends a ride", async () => {
        const mockResponse = {
            message: "Ride ended successfully"
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await endRide(123, 1, 42);  // tripId=123, userId=1, bikeId=42

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/trips/123",
            expect.objectContaining({
                method: "PATCH",
                body: JSON.stringify({
                    user_id: 1,
                    bike_id: 42,
                }),
                headers: { "Content-Type": "application/json" },
            })
        );

        expect(response).toEqual(mockResponse);
    });

    test("endRide handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 404 });

        await expect(endRide(123, 1, 42)).rejects.toThrow("Failed to end ride: 404");
    });

    // Test för fetchRide
    test("fetchRide successfully fetches ride data", async () => {
        const mockRide = {
            data: {
                id: 123,
                attributes: {
                    start_time: "2024-01-01T10:00",
                    end_time: "2024-01-01T11:00",
                    total_fee: 59
                }
            }
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockRide));

        const response = await fetchRide(123);

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/trips/123",
            expect.objectContaining({
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
        );

        expect(response).toEqual(mockRide);
    });

    test("fetchRide handles fetch errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 500 });

        await expect(fetchRide(123)).rejects.toThrow("Failed to fetch ride: 500");
    });
});
