/* eslint-env jest */
import { fetchLogin } from "../api/oauthApi";
import fetchMock from "jest-fetch-mock";

// Aktivera fetchMock
fetchMock.enableMocks();

describe("fetchLogin function", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("fetchLogin successfully logs in with GitHub", async () => {
        const mockResponse = {
            token: "abcd1234",
            user: {
                id: 1,
                email: "user@example.com"
            }
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await fetchLogin("github_code_123");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:8000/v1/oauth/github",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    code: "github_code_123"
                }),
                headers: { "content-type": "application/json" },
            })
        );

        expect(response).toEqual(mockResponse);
    });

    test("fetchLogin handles API error", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: "Invalid code" }), {
            status: 400
        });

        const response = await fetchLogin("invalid_code");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:8000/v1/oauth/github",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    code: "invalid_code"
                }),
            })
        );

        expect(response.error).toBe("Invalid code");
    });

    test("fetchLogin handles network errors", async () => {
        fetchMock.mockReject(new Error("Network error"));

        const response = await fetchLogin("github_code_123");

        expect(response).toBeInstanceOf(Error);
        expect(response.message).toBe("Network error");
    });
});
