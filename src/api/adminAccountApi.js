const API_BASE_URL = "http://127.0.0.1:8000/v1/admin/";

export const fetchAdmin = async () => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }
        const response = await fetch(`${API_BASE_URL}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch admin details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching admin details:", error);
        throw error;
    }
};