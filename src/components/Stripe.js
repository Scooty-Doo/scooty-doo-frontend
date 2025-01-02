import React, { useState, useEffect } from "react";
import styles from "../styles/AccountClient.module.css";
import { fillWallet } from "../api/stripeApi";

// Hämta senaste resa pris 

const ProductDisplay = () => {
  const [amount, setAmount] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fillWallet(amount);
      window.location.href = response.data.url;
    } catch (error) {
      console.error(`Failed to add to wallet. Please try again. Details ${error}`)
    }
  };

  const handleInputChange = (e) => {
    setAmount(e.target.value)
  };

  return (
    <section>
    <form className={styles.stripeform} onSubmit={handleSubmit}>
    <div className="product">
      <div className={styles.stripeform}>
      <input 
        type="number"
        id="amount"
        name="amount"
        min="0"
        value={amount}
        onChange={handleInputChange}
        required>
      </input>
      </div>
    </div>
      <button type="submit" className={styles.saveButtonSaldo}>
        Fyll på saldo
      </button >
    </form>
  </section>
  )
  // Om senaste resa inte betald - knapp betala din senaste resa
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Stripe() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Saldo påfyllt!");
    }

    if (query.get("canceled")) {
      setMessage(
        "Påfyllning av saldo avbruten."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}