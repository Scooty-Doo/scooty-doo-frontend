import React, { useState, useEffect } from "react";
import styles from "../../styles/AccountClient.module.css";
import { fetchUser } from "../../api/userApi";

const AccountClient = () => {
    const user_id = 1; // Eller hämta från props/context om det behövs

    // State för användarinfo
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        address: "", // Address finns inte i datan; kan vara statisk eller borttagen
        phone: "", // Phone finns inte i datan; kan vara statisk eller borttagen
        wallet: 0,
    });

    // Hämta användarinfo från API vid komponentens första render
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userData = await fetchUser(user_id);
                // Omforma datan från API till det format som används i `userInfo`
                const formattedData = {
                    name: userData.data.attributes.full_name,
                    email: userData.data.attributes.email,
                    address: "", // Lämna tom om address inte används
                    phone: "", // Lämna tom om phone inte används
                    wallet: userData.data.attributes.balance,
                };
                setUserInfo(formattedData); // Uppdatera state
            } catch (error) {
                console.error("Error fetching user info:", error);
                alert("Kunde inte hämta användarinformation.");
            }
        };

        getUserInfo();
    }, [user_id]); // Kör om `user_id` ändras

    // Hantera inputförändringar i formuläret
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Spara ändringar
    const handleSaveChanges = (e) => {
        e.preventDefault();
        console.log("Uppdaterade användardetaljer:", userInfo);
        alert("Dina ändringar har sparats!");
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
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={userInfo.address}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>
                        <button type="submit" className={styles.saveButton}>
                            Spara ändringar
                        </button>
                    </form>
                </div>
                {/* Höger kolumn */}
                <div className={styles.rightColumn}>
                    <h2 className={styles.saldo}>Scooty Saldo:</h2>
                    <p className={styles.money}>{userInfo.wallet} :-</p>
                    <button className={styles.saveButtonSaldo}>
                        Fyll på Saldo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountClient;
