import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NavbarAdmin.module.css'; // Importera CSS-modulen
import { FaHome, FaHistory, FaUser, FaCog } from 'react-icons/fa'; // Importera ikoner från react-icons

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/">
            <span className={styles.navText}>Start</span>
            <FaHome className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/home">
            <span className={styles.navText}>Home</span>
            <FaHome className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/history">
            <span className={styles.navText}>History</span>
            <FaHistory className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/zone">
            <span className={styles.navText}>Zone</span>
            <FaCog className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/customer">
            <span className={styles.navText}>Customer</span>
            <FaUser className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/account">
            <span className={styles.navText}>Account</span>
            <FaUser className={styles.navIcon} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.navLink} to="/bikeCRUD">
            <span className={styles.navText}>BIKECRUD</span>
            <FaHistory className={styles.navIcon} />
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

export default Navbar;
