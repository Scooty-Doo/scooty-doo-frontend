import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/AccountClient.module.css";
import { fillWallet, stripeSuccessCall } from "../api/stripeApi";

// Hämta senaste resa pris 

const ProductDisplay = () => {
  const [amount, setAmount] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fillWallet(amount, window.location.href);
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
    <p className={styles.stripemessage} >{message}</p>
  </section>
);

export default function Stripe() {
    const [message, setMessage] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    const addMoney = async () => {
        const response = await stripeSuccessCall(searchParams.get('session_id'));
        console.log(response)
        return response
    }

    useEffect(() => {
        if (searchParams.get("success")) {
            console.log(addMoney()) // Här! Här ska userInfo uppdateras! HÄR MAYA!
            setMessage("Saldo påfyllt!");
        }

        if (searchParams.get("canceled")) {
        setMessage("Påfyllning av saldo avbruten.");
        }

        if (searchParams.size == 0)
        {
            setMessage("");
        }
    }, [searchParams]);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}