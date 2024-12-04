import React from 'react';
import { useNavigate } from 'react-router-dom';

// Skapa nytt konto för kund
const CreateAccount = () => {
  // useNavigate för att kunna navigera mellan sidor. 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate('/homeclient'); // Navigera till hem för klient
  };

  return (
    <div>
      <h1>Create Account for Client</h1>
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
            Adress:
            <input
              type="text"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Telefonnummer:
            <input
              type="tel"
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
          <div>
          <label>
            Bekräfta lösenord:
            <input
              type="password"
              required
            />
          </label>
        </div>
        <button type="submit">Skapa Konto</button>
      </form>
    </div>
  );
};

export default CreateAccount;
