// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'; // Importera CSS-modulen

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/">Start</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/home">Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/history">History</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/zone">Zone</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/customer">Customer</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/account">Account</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/homeclient">StartK</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/accountclient">AccountK</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/historyclient">HistoryK</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
