import React, { useState } from "react";
import styles from "../../styles/AccountAdmin.module.css";

const AccountAdmin = () => {
    const [formData, setFormData] = useState({
        username: "Tim Lundqvist",
        email: "tim@mail.com",
        phoneNumber: "0725558468",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form submitted:", formData);
            alert("Ändringar sparade!");
            // Spara ändringar logik här
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) errors.username = "Användarnamn krävs";
        if (!formData.email.trim()) errors.email = "E-postadress krävs";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            errors.email = "Ogiltig e-postadress";
        if (!formData.phoneNumber.trim())
            errors.phoneNumber = "Telefonnummer krävs";
        return errors;
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <h2 className={styles.heading}>Ändra Admin-uppgifter</h2>
            <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                    Användarnamn:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ange ditt användarnamn"
                    className={styles.input}
                />
                {errors.username && (
                    <p className={styles.error}>{errors.username}</p>
                )}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                    E-postadress:
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ange din e-postadress"
                    className={styles.input}
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="phoneNumber" className={styles.label}>
                    Telefonnummer:
                </label>
                <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Ange ditt telefonnummer"
                    className={styles.input}
                />
                {errors.phoneNumber && (
                    <p className={styles.error}>{errors.phoneNumber}</p>
                )}
            </div>
            <button type="submit" className={styles.button}>
                Spara ändringar
            </button>
        </form>
    );
};

export default AccountAdmin;
