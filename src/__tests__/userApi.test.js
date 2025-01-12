import {
    fetchUser,
    fetchUserTrips,
    fetchUserTransactions,
    userDetails,
    userDetails2
} from "../api/userApi";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("userApi", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Tysta loggar
    });

    test("fetchUser fetches user data successfully", async () => {
        const mockResponse = { data: { id: 1, full_name: "Scooty" } };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const userData = await fetchUser(1);
        expect(userData).toEqual(mockResponse);
    });

    test("fetchUser handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 404 });

        await expect(fetchUser(1)).rejects.toThrow("Failed to fetch user: 404");
    });

    test("fetchUser handles invalid JSON response", async () => {
        fetchMock.mockResponseOnce("invalid-json", { status: 200 });

        await expect(fetchUser(1)).rejects.toThrow();
    });

    test("fetchUserTrips fetches trips successfully", async () => {
        const mockTrips = { trips: [{ id: 1, start: "2024-01-01", end: "2024-01-02" }] };
        fetchMock.mockResponseOnce(JSON.stringify(mockTrips));

        const trips = await fetchUserTrips(1);
        expect(trips).toEqual(mockTrips);
    });

    test("fetchUserTrips handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 500 });

        await expect(fetchUserTrips(1)).rejects.toThrow("Failed to fetch user: 500");
    });

    test("fetchUserTransactions fetches transactions successfully", async () => {
        const mockTransactions = { transactions: [{ id: 1, amount: 100, type: "deposit" }] };
        fetchMock.mockResponseOnce(JSON.stringify(mockTransactions));

        const transactions = await fetchUserTransactions(1);
        expect(transactions).toEqual(mockTransactions);
    });

    test("fetchUserTransactions handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 404 });

        await expect(fetchUserTransactions(1)).rejects.toThrow("Failed to fetch user: 404");
    });

    test("userDetails updates user successfully", async () => {
        const mockResponse = { message: "User updated successfully" };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const result = await userDetails(1, "Scooty", "test@example.com", true);
        expect(result).toEqual(mockResponse);
    });

    test("userDetails handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 400 });

        await expect(userDetails(1, "Scooty", "test@example.com", true)).rejects.toThrow(
            "Failed to update user details: 400"
        );
    });

    test("userDetails2 updates user with GitHub login", async () => {
        const mockResponse = { message: "User updated successfully with GitHub" };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const result = await userDetails2(1, "Scooty", "test@example.com", "scooty-github", true);
        expect(result).toEqual(mockResponse);
    });

    test("userDetails2 handles API errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 500 });

        await expect(
            userDetails2(1, "Scooty", "test@example.com", "scooty-github", true)
        ).rejects.toThrow("Failed to update user details: 500");
    });

    test("userDetails2 handles network errors", async () => {
        fetchMock.mockRejectOnce(new Error("Network Error"));

        await expect(
            userDetails2(1, "Scooty", "test@example.com", "scooty-github", true)
        ).rejects.toThrow("Network Error");
    });
});
