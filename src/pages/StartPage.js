import React from 'react';
import { Link } from 'react-router-dom';

const StartPage = () => (
  <div>
    <h1>Home Page for client</h1>
    <Link to="/loginclient">
      <button>Go to Login</button>
    </Link>
  </div>
);

export default StartPage;
