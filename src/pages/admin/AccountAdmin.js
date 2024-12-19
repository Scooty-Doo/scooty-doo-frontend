import React, { useState } from "react";
import styles from "../../styles/AccountAdmin.module.css";

const AccountAdmin = () => {
  const [formData, setFormData] = useState({
    username: "Tim Lundqvist",
    email: "tim@mail.com",
    phoneNumber: "0725558468",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => { // För när ett fält blir ändrat
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // updaterar formdata
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // tillfälligt för att stoppa sidan från att refresha efter submitt (tas bort när sidan fungerar)
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) { // om inga errors
      console.log("Form submitted:", formData);
      alert("Ändringar sparade!");
      // Spara ändringar logik här
    } else {
      setErrors(validationErrors); // Om error set error state
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Användarnamn krävs"; // kollar att användarnamn finns
    if (!formData.email.trim()) errors.email = "E-postadress krävs"; // sama som ovan fast för emails
    else if (!/\S+@\S+\.\S+/.test(formData.email)) // kollar att epost är rätt format
      errors.email = "Ogiltig e-postadress";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Telefonnummer krävs";
    if (formData.newPassword !== formData.confirmPassword) // om lösen inte matchar
      errors.confirmPassword = "Lösenorden matchar inte";
    return errors;
  };

  return ( // formuläret
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
      <div className={styles.formGroup}>
        <label htmlFor="newPassword" className={styles.label}>
          Nytt lösenord:
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Ange ett nytt lösenord"
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Bekräfta lösenord:
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Bekräfta ditt nya lösenord"
          className={styles.input}
        />
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
      </div>
      <button type="submit" className={styles.button}>
        Spara ändringar
      </button>
    </form>
  );
};

export default AccountAdmin;
