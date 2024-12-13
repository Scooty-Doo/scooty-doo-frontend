import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'; // Importera CSS-modulen
import { FaHome, FaHistory, FaUser, FaCog } from 'react-icons/fa'; // Importera ikoner från react-icons

const NavbarClient = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/loginclient">
            <span className={styles.navText}>Start</span>
            <FaHome className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/homeclient">
            <span className={styles.navText}>StartK</span>
            <FaHome className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/accountclient">
            <span className={styles.navText}>AccountK</span>
            <FaUser className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/historyclient">
            <span className={styles.navText}>HistoryK</span>
            <FaHistory className={styles.navIcon} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarClient;
