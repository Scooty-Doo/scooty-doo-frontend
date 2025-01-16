import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NavbarAdmin.module.css'; // Importera CSS-modulen
import { FaHome, FaUser, FaUsers, FaSignOutAlt, FaCog } from 'react-icons/fa'; // Importera ikoner från react-icons
import { useNavigate } from "react-router-dom";
import logo from '../pic/logga.png';

const Navbar = () => {
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
                    <Link className={styles.navLink} to="/home">
                        <span className={styles.navText}>Home</span>
                        <FaHome className={styles.navIcon} />
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
                        <FaUsers className={styles.navIcon} />
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
                        <span className={styles.navText}>bikeCRUD</span>
                        <FaUser className={styles.navIcon} />
                    </Link>
                </li>
                <button className={styles.navLink} onClick={handleLogout}>
                    <span className={styles.navText}>Logout</span>
                    <FaSignOutAlt className={styles.navIcon} />
                </button>

            </ul>
        </nav>
    );
};

export default Navbar;
