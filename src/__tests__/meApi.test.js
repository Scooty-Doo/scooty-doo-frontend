/* eslint-env jest */
import { fetchUser, userDetails, fetchUserTrips } from "../api/meApi";

global.fetch = jest.fn();

describe("User API functions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.setItem("token", "test-token");
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    describe("fetchUser", () => {
        test("successfully fetches user information", async () => {
            const mockResponse = {
                data: {
                    attributes: {
                        full_name: "Maya Edlund",
                        email: "maya@example.com",
                        use_prepay: true,
                    },
                },
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await fetchUser();
            expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/v1/me/", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer test-token",
                    "Content-Type": "application/json",
                },
            });
            expect(response).toEqual(mockResponse);
        });

        test("throws error if token is missing", async () => {
            sessionStorage.removeItem("token");
            await expect(fetchUser()).rejects.toThrow("Ingen token hittades i sessionStorage");
        });

        test("throws error if API response is not ok", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
            });
            await expect(fetchUser()).rejects.toThrow("Failed to fetch user: 401");
        });
    });

    describe("userDetails", () => {
        test("successfully updates user details", async () => {
            const mockResponse = {
                data: {
                    attributes: {
                        full_name: "Maya Edlund",
                        email: "maya@example.com",
                        use_prepay: false,
                    },
                },
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await userDetails("Maya Edlund", "maya@example.com", false);
            expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/v1/me/", {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer test-token",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name: "Maya Edlund",
                    email: "maya@example.com",
                    use_prepay: false,
                }),
            });
            expect(response).toEqual(mockResponse);
        });

        test("throws error if token is missing", async () => {
            sessionStorage.removeItem("token");
            await expect(userDetails("Maya Edlund", "maya@example.com", false)).rejects.toThrow(
                "Ingen token hittades i sessionStorage"
            );
        });

        test("throws error if API response is not ok", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
            });
            await expect(userDetails("Maya Edlund", "maya@example.com", false)).rejects.toThrow(
                "Failed to update user details: 400"
            );
        });
    });

    describe("fetchUserTrips", () => {
        test("successfully fetches user trips", async () => {
            const mockResponse = {
                data: [
                    { id: 1, attributes: { start_time: "2025-01-01T10:00:00Z", end_time: "2025-01-01T12:00:00Z" } },
                    { id: 2, attributes: { start_time: "2025-01-02T14:00:00Z", end_time: "2025-01-02T16:00:00Z" } },
                ],
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await fetchUserTrips();
            expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/v1/me/trips", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer test-token",
                    "Content-Type": "application/json",
                },
            });
            expect(response).toEqual(mockResponse);
        });

        test("throws error if token is missing", async () => {
            sessionStorage.removeItem("token");
            await expect(fetchUserTrips()).rejects.toThrow("Ingen token hittades i sessionStorage");
        });

        test("throws error if API response is not ok", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            });
            await expect(fetchUserTrips()).rejects.toThrow("Failed to fetch user: 404");
        });
    });
});
