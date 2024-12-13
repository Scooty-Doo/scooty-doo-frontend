import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/StartPage.module.css';

// Startsida för alla
const StartPage = () => (
  <div className={styles.startPage}>
    <h1 className={styles.title}>SCOOTY DOO</h1>
    <p className={styles.subtitle}>Let's go for a Scooty-Dooby-Doo Ride!</p>
    <div className={styles.buttonContainer}>
      <Link to="/loginclient">
        <button className={styles.button}>Login</button>
      </Link>
      <Link to="/createaccount">
        <button className={styles.button}> Sign Up</button>
      </Link>
      <Link to="/login">
        <p className={styles.adminLink}>Admin</p>
      </Link>
    </div>
  </div>
);

export default StartPage;
