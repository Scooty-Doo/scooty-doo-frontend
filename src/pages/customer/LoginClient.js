import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/LoginClient.module.css';

//Login för kund
const LoginClient = () => {
  // useNavigate för att kunna navigera till andra sidor
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/homeclient'); // Navigera till hem för kund när loggat in
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Login Page</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password:
            <input
              id="password"
              type="password"
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </label>
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>

    </div>
  );
};

export default LoginClient;
