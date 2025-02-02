import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/LoginClient.module.css';
import { FaGithub } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';

const LoginClient = ({basename}) => {

    useEffect(() => {
    // Lägg till en unik klass på body
        document.body.classList.add(styles.loginBody);

        // Ta bort klassen när komponenten unmountar
        return () => {
            document.body.classList.remove(styles.loginBody);
        };
    }, []);


    const gitHubLogin = (e) => {
        e.preventDefault();
        sessionStorage.setItem("role", e.currentTarget.innerText.toLowerCase()) //e-currenrtarget istället för e.target
        const clientId = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_GITHUB_CLIENT : process.env.REACT_APP_GITHUB_CLIENT_DEV;
        
        const redirectURI = window.location.href.endsWith(basename)
            ? `${window.location.href}#/githublogin`
            : `${window.location.href.replace(basename, '')}${basename}#/githublogin`;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}`
    }

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>Login</h1>

            <div className={styles.orContainer}>
                <span className={styles.line}></span>
                <span className={styles.orText}> with</span>
                <span className={styles.line}></span>
            </div>

            <button className={`${styles.button} ${styles.githubButton}`} onClick={gitHubLogin}>
                <FaGithub className={styles.githubIcon} style={{ marginRight: '10px' }} />
        GitHub
            </button>

            <button className={`${styles.button} ${styles.adminButton}`} onClick={gitHubLogin}>
                <FaUser className={styles.githubIcon} style={{ marginRight: '10px' }} />
                Admin
            </button>
        </div>
    );
};

LoginClient.propTypes = {
    basename: PropTypes.string.isRequired,
};

export default LoginClient;
