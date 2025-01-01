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
