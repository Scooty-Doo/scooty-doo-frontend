const API_BASE_URL = "http://127.0.0.1:8000/v1/me/";


// Hämta information om en användare
export const fetchUser = async ({token}) => {
    try {
        console.log(token)
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
