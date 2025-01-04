/* eslint-env jest */
import {
    fetchUser,
    fetchUserTrips,
    fetchUserTransactions,
    userDetails
} from "../api/userApi";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("userApi functions", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    // Test för fetchUser
    test("fetchUser fetches user data successfully", async () => {
        const mockResponse = {
            data: {
                id: 1,
                attributes: {
                    full_name: "Scooty Prepaidson",
                    email: "scooty@example.com",
                    balance: 100.0,
                }
            }
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const userData = await fetchUser(1);

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/users/1",
            expect.objectContaining({
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
        );

        expect(userData).toEqual(mockResponse);
    });

    test("fetchUser handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 404 });

        await expect(fetchUser(1)).rejects.toThrow("Failed to fetch user: 404");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/users/1",
            expect.objectContaining({
                method: "GET",
            })
        );
    });

    // Test för fetchUserTrips
    test("fetchUserTrips fetches user trips successfully", async () => {
        const mockTrips = {
            trips: [
                { id: 1, start: "2024-01-01T10:00", end: "2024-01-01T11:00" },
                { id: 2, start: "2024-01-02T14:00", end: "2024-01-02T15:00" }
            ]
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockTrips));

        const trips = await fetchUserTrips(1);

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/users/1/trips",
            expect.objectContaining({
                method: "GET",
            })
        );

        expect(trips).toEqual(mockTrips);
    });

    test("fetchUserTrips handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 500 });

        await expect(fetchUserTrips(1)).rejects.toThrow("Failed to fetch user: 500");
    });

    // Test för userDetails (PATCH-anrop)
    test("userDetails updates user successfully", async () => {
        const mockResponse = { message: "User updated successfully" };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const result = await userDetails(1, "Scooty Prepaidson", "scooty@example.com", true);

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/users/1",
            expect.objectContaining({
                method: "PATCH",
                body: JSON.stringify({
                    full_name: "Scooty Prepaidson",
                    email: "scooty@example.com",
                    use_prepay: true
                })
            })
        );

        expect(result).toEqual(mockResponse);
    });

    test("userDetails handles failed update", async () => {
        fetchMock.mockResponseOnce(null, { status: 400 });

        await expect(userDetails(1, "Scooty Prepaidson", "scooty@example.com", true))
            .rejects
            .toThrow("Failed to update user details: 400");
    });
});
