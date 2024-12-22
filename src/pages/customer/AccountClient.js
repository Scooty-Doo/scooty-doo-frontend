import React, { useState } from "react";
import styles from "../../styles/AccountClient.module.css";

// Accountklienten ska hantera användarinfo och kontoändringar
const AccountClient = () => {

    // Skapa test-användare
    const [userInfo, setUserInfo] = useState({
        name: "Maya Edlund",
        email: "maya@example.com",
        address: "Testgatan 1, 12345 Teststad",
        phone: "0701234567",
        wallet: 513,
    });

    // Hantera inputförändringar i formuläret
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Kolla om lösenordet matchar
    const handleSaveChanges = (e) => {
        e.preventDefault();
        // Skriv ut ändringarna
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
                                required
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
                                required
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
