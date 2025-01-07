const API_BASE_URL = "http://127.0.0.1:8000/v1/stripe/";

export const fillWallet = async (amount, frontend_url) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
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
            throw new Error(`Failed to add to wallet: ${response.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const stripeSuccessCall  = async (session_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}success`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                session_id: session_id
            }),
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.message}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};