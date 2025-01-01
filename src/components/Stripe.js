import React, { useState, useEffect } from "react";
import styles from "../styles/AccountClient.module.css";


// Hämta senaste resa pris 

const ProductDisplay = () => (
  <section>
    <div className="product">
      <div className={styles.stripeform}>
      <input type="number" name="priceId" min="0"></input>
      </div>
    </div>
    <form className={styles.stripeform} action="/create-checkout-session" method="POST">
      <button type="submit" className={styles.saveButtonSaldo}>
        Fyll på saldo
      </button >
    </form>
  </section>

  // Om senaste resa inte betald - knapp betala din senaste resa
);

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