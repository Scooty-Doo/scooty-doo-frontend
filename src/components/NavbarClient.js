import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'; // Importera CSS-modulen
import { FaHome, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importera ikoner från react-icons
import logo from '../pic/logga.png';

const NavbarClient = () => {
  return (
    <nav className={styles.navbar}>
      {/* Logotypen */}
      <Link to="/homeclient">
        <img 
          src={logo} 
          alt="Logo" 
          className={styles.logo} 
        />
      </Link>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/homeclient">
            <span className={styles.navText}>Home</span>
            <FaHome className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/accountclient">
            <span className={styles.navText}>Account</span>
            <FaUser className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/historyclient">
            <span className={styles.navText}>History</span>
            <FaHistory className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/">
            <span className={styles.navText}>Logout</span>
            <FaSignOutAlt className={styles.navIcon} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarClient;
