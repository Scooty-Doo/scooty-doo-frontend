import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginClient = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate('/homeclient'); // Navigera till hem
  };

  return (
    <div>
      <h1>Login Page for Client</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="email"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginClient;
