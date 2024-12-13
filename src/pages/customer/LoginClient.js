import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../../styles/LoginClient.module.css';
import { FaGithub } from 'react-icons/fa';

const LoginClient = () => {
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

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            <input
              id="password"
              type="password"
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </label>
        </div>
        <button type="submit" className={styles.loginbutton}>Login</button>
      </form>

      <div className={styles.orContainer}>
        <span className={styles.line}></span>
        <span className={styles.orText}>or login with</span>
        <span className={styles.line}></span>
      </div>

      <button className={`${styles.button} ${styles.githubButton}`}>
        <FaGithub className={styles.githubIcon} style={{ marginRight: '10px' }} />
        GitHub
      </button>

      <p className={styles.createAccountText}>
        Not a member? <Link to="/createaccount">Signup</Link>
      </p>

      <p className={styles.AdminText}>
        <Link to="/login">Admin</Link>
      </p>
    </div>
  );
};

export default LoginClient;
