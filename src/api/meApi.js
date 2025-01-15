const API_BASE_URL = "http://127.0.0.1:8000/v1/me/";


// Hämta information om en användare
export const fetchUser = async () => {
    try {
        // Hämta token från sessionStorage
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }

        const response = await fetch(`${API_BASE_URL}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
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
export const userDetails = async (name, email, use_prepay) => {
    try {
        // Hämta token från sessionStorage
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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

export const fetchUserTrips = async () => {
    try {
        // Hämta token från sessionStorage
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }
        const response = await fetch(`${API_BASE_URL}trips`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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