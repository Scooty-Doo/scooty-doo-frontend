const API_BASE_URL = "http://127.0.0.1:8000/v1/zones/";

// Hämta information om cyklarna
export const fetchZones = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch zones: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching zones:", error);
        throw error;
    }
};