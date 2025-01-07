const API_BASE_URL = "http://127.0.0.1:8000/v1/users/";


// Hämta information om en användare
export const fetchUser = async (user_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const fetchUserTrips = async (user_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${user_id}/trips`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
  
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }
  
        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const fetchUserTransactions = async (user_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${user_id}/transactions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};


// API-funktion för att uppdatera användardetaljer
export const userDetails = async (userId, name, email, use_prepay) => {
    try {
        const response = await fetch(`${API_BASE_URL}${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name: name,
                email: email,
                use_prepay: use_prepay,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// API-funktion för att uppdatera användardetaljer
export const userDetails2 = async (userId, name, email, github_login, use_prepay) => {
    try {
        const response = await fetch(`${API_BASE_URL}${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name: name,
                email: email,
                github_login: github_login,
                use_prepay: use_prepay,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
