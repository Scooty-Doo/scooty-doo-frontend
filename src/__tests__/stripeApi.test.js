/* eslint-env jest */
import { fillWallet, stripeSuccessCall } from "../api/stripeApi";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("stripeApi functions", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("fillWallet adds to wallet", async () => {
        const mockResponse = {
            message: "Wallet updated successfully",
            session_id: "sess_12345"
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await fillWallet(500, "http://localhost/success");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/stripe/",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    amount: 500,
                    frontend_url: "http://localhost/success"
                }),
                headers: { "Content-Type": "application/json" },
            })
        );

        expect(response).toEqual(mockResponse);
    });

    test("fillWallet handles errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 400 });

        await expect(fillWallet(500, "http://localhost/success")).rejects.toThrow(
            "Failed to add to wallet"
        );
    });

    // Test för stripeSuccessCall
    test("stripeSuccessCall successfully confirms a session", async () => {
        const mockResponse = {
            message: "Payment successful",
            amount: 500
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await stripeSuccessCall("sess_12345");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/v1/stripe/success",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    session_id: "sess_12345",
                }),
                headers: { "Content-Type": "application/json" },
            })
        );

        expect(response).toEqual(mockResponse);
    });

    test("stripeSuccessCall handles server errors", async () => {
        fetchMock.mockResponseOnce(null, { status: 500 });

        await expect(stripeSuccessCall("sess_12345")).rejects.toThrow(
            "Server error"
        );
    });
});
