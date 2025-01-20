const API_BASE_URL = "http://127.0.0.1:8000/v1/users/";

// Hämta information om en användare med dynamiska sökparametrar
export const fetchCustomer = async ({ name_search = "", email_search = "", github_login_search = "" } = {}) => {
    try {
        const token = sessionStorage.getItem("token");
        // Bygg query-parametrar baserat på inmatade värden
        const params = new URLSearchParams();
        if (name_search) params.append("name_search", name_search);
        if (email_search) params.append("email_search", email_search);
        if (github_login_search) params.append("github_login_search", github_login_search);

        // Bygg den fullständiga URL:en
        const fullUrl = `${API_BASE_URL}?${params.toString()}`;
        console.log("Request URL:", fullUrl); // Logga URL:en

        // Skicka GET-förfrågan till API:et
        const response = await fetch(fullUrl, {
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
