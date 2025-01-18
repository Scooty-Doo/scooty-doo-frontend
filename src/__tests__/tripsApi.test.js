import { startRide, endRide, fetchRide } from "../api/tripsApi";

// Mock global fetch
global.fetch = jest.fn();

describe("Trips API functions", () => {
    beforeEach(() => {
        // Mock sessionStorage
        Object.defineProperty(window, "sessionStorage", {
            value: {
                getItem: jest.fn((key) => {
                    if (key === "token") return "test-token";
                    return null;
                }),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });

        // Mock console.error to suppress error logs
        jest.spyOn(console, "error").mockImplementation(() => {});

        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
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
            window.sessionStorage.getItem.mockReturnValueOnce(null);

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
            window.sessionStorage.getItem.mockReturnValueOnce(null);

            await expect(endRide("trip-id-1", "bike-id-1")).rejects.toThrow("Ingen token hittades i sessionStorage");
        });

        test("throws error if API response is not ok", async () => {
            const errorResponse = { error: "Not found" };
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => errorResponse,
            });

            await expect(endRide("trip-id-1", "bike-id-1")).rejects.toThrow("Failed to end ride: Not found");
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
            window.sessionStorage.getItem.mockReturnValueOnce(null);

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
