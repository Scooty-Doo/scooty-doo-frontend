const API_BASE_URL = "http://127.0.0.1:8000/v1/bikes/";
// Hämta information om cyklarna
export const fetchBikes = async () => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }
        const response = await fetch(`${API_BASE_URL}?limit=9999`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch bikes: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching bikes:", error);
        throw error;
    }
};

export const fetchAvailableBikes = async (cityId) => {
    try {
        // Hämta token från sessionStorage
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }
        const response = await fetch(`${API_BASE_URL}available?limit=10000000&city_id=${cityId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch bikes: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching bikes:", error);
        throw error;
    }
};

// Hämta information om en cykel
export const fetchBike = async (bike_id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}${bike_id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch bike: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching bike:", error);
        throw error;
    }
};

export const fetchBikeByCityApi = async (cityId) => {

    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}?city_id=${cityId}&limit=9999`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch bike by cityId: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching bike by cityId:", error);
        throw error;
    }
};

// API-funktion för att uppdatera cykeldetaljer
export const bikeDetails = async (bike_id, battery_level, city_id, position, availability) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}${bike_id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                battery_lvl: battery_level,
                city_id: city_id,
                last_position: position,
                is_available: availability,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update bike details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const fetchBikesInZone = async (zoneTypeId, cityId) => {
    try {
        // Hämta token från sessionStorage
        const token = sessionStorage.getItem("token");
        if (!token) {
            throw new Error("Ingen token hittades i sessionStorage");
        }
        const response = await fetch(`${API_BASE_URL}bikes_in_zone?zone_type_id=${zoneTypeId}&city_id=${cityId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch bikes in zone: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching bikes in zonetype:", error);
        throw error;
    }
};

export const bikeDelete = async (bike_id) => {

    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this bike?");

    if (!confirmDelete) {
        console.log("Delete action canceled by user.");
        return; // Exit the function if the user cancels
    }

    console.log(`Attempting to delete bike with ID: ${bike_id}`);

    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}${bike_id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 204) {
            console.log('Bike deleted successfully');
        } else {
            throw new Error('Failed to delete the bike');
        }
    } catch (error) {
        console.error('Error deleting bike:', error);
    }
};

