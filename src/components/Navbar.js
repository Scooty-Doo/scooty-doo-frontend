// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/">Start</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/home">Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/history">History</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/zone">Zone</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/customer">Customer</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/account">Account</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/homeclient">StartK</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/accountclient">AccountK</Link>
        </li>
        <li style={styles.navItem}>
          <Link style={styles.navLink} to="/historyclient">HistoryK</Link>
        </li>
      </ul>
    </nav>
  );
};

// Inline styles (Optional)
const styles = {
  navbar: {
    background: '#333',
    padding: '10px',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 10px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
};

export default Navbar;
