import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'; // Importera CSS-modulen
import { FaHome, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importera ikoner från react-icons
import logo from '../pic/logga.png';
import { useNavigate } from "react-router-dom";

const NavbarClient = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

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
                    <button className={`${styles.navLink} ${styles.logoutButton}`} onClick={handleLogout}>
                        <span className={styles.navText}>Logout</span>
                        <FaSignOutAlt className={styles.navIcon} />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavbarClient;
