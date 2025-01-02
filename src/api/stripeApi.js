const API_BASE_URL = "http://127.0.0.1:8000/v1/stripe/";

export const fillWallet = async (amount) => {
  try {
      const response = await fetch(`${API_BASE_URL}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              amount: amount
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
