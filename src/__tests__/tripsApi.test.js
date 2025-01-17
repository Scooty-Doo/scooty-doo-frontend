/* eslint-env jest */

import { startRide, endRide, fetchRide } from "../api/tripsApi";

global.fetch = jest.fn();

describe("Trips API functions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.setItem("token", "test-token");
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    describe("startRide", () => {
        test("successfully starts a ride", async () => {
            const mockResponse = { data: { id: "123", status: "started" } };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await startRide("bike-id-1");
            expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/v1/trips/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer test-token",
                },
                body: JSON.stringify({ bike_id: "bike-id-1" }),
            });
            expect(response).toEqual(mockResponse);
        });

        test("throws error if token is missing", async () => {
            sessionStorage.removeItem("token");
            await expect(startRide("bike-id-1")).rejects.toThrow("Ingen token hittades i sessionStorage");
        });

        test("throws error if API response is not ok", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
            });
            await expect(startRide("bike-id-1")).rejects.toThrow("Failed to start ride: 400");
        });
    });

    describe("endRide", () => {
        test("successfully ends a ride", async () => {
            const mockResponse = { data: { id: "123", status: "ended" } };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await endRide("trip-id-1", "bike-id-1");
            expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/v1/trips/trip-id-1", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer test-token",
                },
                body: JSON.stringify({ bike_id: "bike-id-1" }),
            });
            expect(response).toEqual(mockResponse);
        });

        test("throws error if token is missing", async () => {
            sessionStorage.removeItem("token");
            await expect(endRide("trip-id-1", "bike-id-1")).rejects.toThrow("Ingen token hittades i sessionStorage");
        });

        test("throws error if API response is not ok", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ error: "Not found" }),
            });
            await expect(endRide("trip-id-1", "bike-id-1")).rejects.toThrow("Failed to end ride: 404");
        });
    });

    describe("fetchRide", () => {
        test("successfully fetches ride information", async () => {
            const mockResponse = { data: { id: "123", status: "details" } };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await fetchRide("trip-id-1");
            expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/v1/trips/trip-id-1", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer test-token",
                },
            });
            expect(response).toEqual(mockResponse);
        });

        test("throws error if token is missing", async () => {
            sessionStorage.removeItem("token");
            await expect(fetchRide("trip-id-1")).rejects.toThrow("Ingen token hittades i sessionStorage");
        });

        test("throws error if API response is not ok", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });
            await expect(fetchRide("trip-id-1")).rejects.toThrow("Failed to fetch ride: 500");
        });
    });
});
