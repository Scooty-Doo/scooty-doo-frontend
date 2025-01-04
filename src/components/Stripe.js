import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'; //Import av proptypes
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
    }

    const handleInputChange = (e) => {
        setAmount(e.target.value)
    };

    return (
        <div>
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
                            className={styles.stripeAmount}
                            required>
                        </input>
                    </div>
                </div>
                <button type="submit" className={styles.saveButtonSaldo}>
        Fyll på saldo
                </button >
            </form>
        </div>
    )
    // Om senaste resa inte betald - knapp betala din senaste resa
};

const Message = ({ message }) => (
    <section>
        <p className={styles.stripemessage} >{message}</p>
    </section>
);


// Message propTyoes
Message.propTypes = {
    message: PropTypes.string.isRequired,
};

export default function Stripe({ wallet }) {
    const [newBalance, setNewBalance] = useState(0.0)
    const [message, setMessage] = useState();
    const [searchParams] = useSearchParams(); //ta bort setsearchparams

    useEffect(() => {
        const updateWallet = async () => {
            const addMoney = async () => {
                const response = await stripeSuccessCall(searchParams.get('session_id'));
                console.log(response);
                return response.data.balance;
            }
            
            if (searchParams.get("success")) {
                const newBalanceFromApi = await addMoney();
                setNewBalance(newBalanceFromApi);
                window.history.replaceState(null, "", `${window.location.pathname}#/homeclient`);
                setMessage("Saldo påfyllt!");
            }

            if (searchParams.get("canceled")) {
                setMessage("Påfyllning av saldo avbruten.");
            }

            if (searchParams.size === 0) {
                setMessage("");
            }
        };

        updateWallet();
    }, [searchParams]);

    return (
        <div>
            <h2 className={styles.saldo}>Scooty Saldo:</h2>
            <p className={styles.money}>{newBalance ? newBalance : wallet} :-</p>
            {message ?  <Message message={message} /> 
                : 
                <ProductDisplay />}
        </div>
    );
}

Stripe.propTypes = {
    wallet: PropTypes.number.isRequired,
};
