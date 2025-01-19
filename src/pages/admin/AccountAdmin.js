import React, { useState, useEffect } from "react";
import styles from "../../styles/AccountAdmin.module.css";
import { fetchAdmin } from '../../api/adminAccountApi';

const AccountAdmin = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        github_login: "",
        created_at: "",
        updated_at: "",
        id: "",
        self: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const adminDetails = async () => {
            try {
                const adminData = await fetchAdmin();
                console.log("admin details: ", adminData);

                if (!adminData || !adminData.data || !adminData.data.attributes) {
                    console.error("Invalid admin data:", adminData);
                    return;
                }

                setFormData({
                    full_name: adminData.data.attributes.full_name || "",
                    email: adminData.data.attributes.email || "",
                    github_login: adminData.data.attributes.github_login || "",
                    created_at: adminData.data.attributes.created_at || "",
                    updated_at: adminData.data.attributes.updated_at || "",
                    id: adminData.data.id || "",
                    self: adminData.links?.self || "",
                });
            } catch (error) {
                console.error("Error fetching admin details:", error);
            }
        };

        adminDetails();
    }, []);

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
        if (!formData.full_name.trim()) errors.full_name = "Användarnamn krävs";
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
                <label htmlFor="full_name" className={styles.label}>
                    Användarnamn:
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Ange ditt användarnamn"
                    className={styles.input}
                />
                {errors.full_name && (
                    <p className={styles.error}>{errors.full_name}</p>
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
                <label htmlFor="github_login" className={styles.label}>
                    Github Login:
                </label>
                <input
                    type="text"
                    id="github_login"
                    name="github_login"
                    value={formData.github_login}
                    onChange={handleChange}
                    placeholder="Ange ditt telefonnummer"
                    className={styles.input}
                />
                {errors.github_login && (
                    <p className={styles.error}>{errors.github_login}</p>
                )}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="id" className={styles.label}>
                    Id:
                </label>
                <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    readOnly
                    placeholder="Ange ditt telefonnummer"
                    className={styles.input}
                />
                {errors.id && (
                    <p className={styles.error}>{errors.id}</p>
                )}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="self" className={styles.label}>
                    Self:
                </label>
                <input
                    type="text"
                    id="self"
                    name="self"
                    value={formData.self}
                    readOnly
                    placeholder="Ange ditt telefonnummer"
                    className={styles.input}
                />
                {errors.self && (
                    <p className={styles.error}>{errors.self}</p>
                )}
            </div>
            <button type="submit" className={styles.button}>
                Spara ändringar
            </button>
        </form>
    );
};

export default AccountAdmin;
