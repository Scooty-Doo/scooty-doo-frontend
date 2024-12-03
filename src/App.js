// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import for components
import Navbar from './components/Navbar';

// Components for admin
import Home     from './pages/admin/HomeAdmin';
import Account  from './pages/admin/AccountAdmin';
import History  from './pages/admin/HistoryAdmin';
import Zone     from './pages/admin/ZoneAdmin';
import Customer from './pages/admin/CustomerAdmin';

// Components for customer
import HomeClient     from './pages/customer/HomeClient';
import AccountClient  from './pages/customer/AccountClient';
import HistoryClient  from './pages/customer/HistoryClient';

import StartPage  from './pages/StartPage';


const App = () => {
  return (
    <Router>
      {/* Reuse Navbar Component */}
      <Navbar />

      {/* Define Routes */}
      <Routes>
        <Route path="/"         element={<StartPage />} />

        <Route path="/home"         element={<Home />} />
        <Route path="/account"  element={<Account />} />
        <Route path="/history"  element={<History />} />
        <Route path="/zone"     element={<Zone />} />
        <Route path="/customer" element={<Customer />} />

        <Route path="/homeclient"  element={<HomeClient />} />
        <Route path="/accountclient"     element={<AccountClient />} />
        <Route path="/historyclient" element={<HistoryClient />} />

        <Route path="*"         element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
