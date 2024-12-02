// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import for components
import Navbar from './components/Navbar';

// Components for pages
import Home     from './pages/Home';
import Account  from './pages/Account';
import History  from './pages/History';
import Zone     from './pages/Zone';
import Customer from './pages/Customer';

const App = () => {
  return (
    <Router>
      {/* Reuse Navbar Component */}
      <Navbar />

      {/* Define Routes */}
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/account"  element={<Account />} />
        <Route path="/history"  element={<History />} />
        <Route path="/zone"     element={<Zone />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="*"         element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
