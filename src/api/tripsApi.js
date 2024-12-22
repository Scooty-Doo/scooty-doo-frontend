const API_BASE_URL = "http://127.0.0.1:8000/v1/trips/";

// Starta en ny resa
export const startRide = async (userId, bikeId) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        bike_id: bikeId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start ride: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error starting ride:", error);
    throw error;
  }
};

// Avsluta en resa
export const endRide = async (tripId, userId, bikeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${tripId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        bike_id: bikeId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to end ride: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error ending ride:", error);
    throw error;
  }
};

// Hämta information om en resa
export const fetchRide = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${tripId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ride: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ride:", error);
    throw error;
  }
};
