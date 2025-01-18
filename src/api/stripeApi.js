const API_STRIPE_BASE_URL = "http://127.0.0.1:8000/v1/stripe/";
const API_TRANSACTION_BASE_URL = "http://127.0.0.1:8000/v1/transactions/";

export const fillWallet = async (amount, frontend_url) => {
    try {
        const response = await fetch(`${API_STRIPE_BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: amount,
                frontend_url: frontend_url 
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Failed to add to wallet: ${errorResponse.message || response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};



export const stripeSuccessCall  = async (session_id) => {
    try {
        const response = await fetch(`${API_TRANSACTION_BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                session_id: session_id,
                // HÅRDKODAD USER_ID
                user_id: 1

            }),
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Server error: ${errorResponse.message || response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};