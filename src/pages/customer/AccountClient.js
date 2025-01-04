import React, { useState, useEffect } from "react";
import styles from "../../styles/AccountClient.module.css";
import { fetchUser } from "../../api/userApi";
import { userDetails } from "../../api/userApi";
import Stripe from "../../components/Stripe";

const AccountClient = () => {
    const user_id = 1;

    // State för användarinfo
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        use_prepay: "",
        wallet: 0.0
    });
    // Hämta användarinfo från API vid komponentens första render
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userData = await fetchUser(user_id);
                const formattedData = {
                    name: userData.data.attributes.full_name,
                    email: userData.data.attributes.email,
                    use_prepay: userData.data.attributes.use_prepay,
                    wallet: userData.data.attributes.balance
                };
                setUserInfo(formattedData); // Uppdatera state
            } catch (error) {
                console.error("Error fetching user info:", error);
                alert("Kunde inte hämta användarinformation.");
            }
        };

        getUserInfo();
    }, [user_id]);

    // Hantera inputförändringar i formuläret
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    // Spara ändringar
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await userDetails(user_id, userInfo.name, userInfo.email, userInfo.use_prepay);
            alert("Dina ändringar har sparats!");
        } catch (error) {
            console.error("Failed to update user details:", error);
            alert("Kunde inte spara ändringar.");
        }
    };

    return (
        <div className={styles.accountContainer}>
            <h1>Ditt konto</h1>
            <div className={styles.accountGrid}>
                {/* Vänster kolumn */}
                <div className={styles.leftColumn}>
                    <form onSubmit={handleSaveChanges}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={userInfo.name}
                                onChange={handleInputChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleInputChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <label htmlFor="payment-method">Välj betalningsmetod:</label>

                        <select
                            id="payment-method"
                            name="use_prepay"
                            value={userInfo.use_prepay}
                            onChange={handleInputChange}
                        >
                            <option value="false">Faktura</option>
                            <option value="true">Plånbok</option>
                        </select>
                        <button type="submit" className={styles.saveButton}>
                            Spara ändringar
                        </button>
                    </form>
                </div>
                {/* Höger kolumn */}
                <div className={styles.rightColumn}>
                    <Stripe wallet={userInfo.wallet}/>
                </div>
            </div>
        </div>
    );
};

export default AccountClient;
