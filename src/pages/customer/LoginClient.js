import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../../styles/LoginClient.module.css';
import { FaGithub } from 'react-icons/fa';

const LoginClient = ({basename}) => {
    const navigate = useNavigate();

    useEffect(() => {
    // Lägg till en unik klass på body
        document.body.classList.add(styles.loginBody);

        // Ta bort klassen när komponenten unmountar
        return () => {
            document.body.classList.remove(styles.loginBody);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/homeclient');
    };

    const gitHubLogin = (e) => {
        e.preventDefault();
        const clientId = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_GITHUB_CLIENT : process.env.REACT_APP_GITHUB_CLIENT_DEV;
    
        const redirectURI = window.location.href + basename + "#/githublogin";
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

            <p className={styles.AdminText}>
                <Link to="/login">Admin</Link>
            </p>
        </div>
    );
};

export default LoginClient;
