import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import for components
import Navbar from './components/Navbar';
import NavbarClient from './components/NavbarClient';

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
import LoginClient    from './pages/customer/LoginClient';
import CreateAccount  from './pages/customer/CreateAccount';

import StartPage  from './pages/StartPage';

// Define layout with dynamic Navbar
const Layout = ({ children }) => {
  const location = useLocation();

  // Define when to show which Navbar or none
  let navbar = null;
  if (location.pathname.startsWith('/homeclient') || 
      location.pathname.startsWith('/accountclient') || 
      location.pathname.startsWith('/historyclient')) {
    navbar = <NavbarClient />;
  } else if (
    location.pathname.startsWith('/home') || 
    location.pathname.startsWith('/account') || 
    location.pathname.startsWith('/history') ||
    location.pathname.startsWith('/zone') ||
    location.pathname.startsWith('/customer')) {
    navbar = <Navbar />;
  }

  return (
    <>
      {navbar}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        {/* Define Routes */}
        <Routes>
          <Route path="/"              element={<LoginClient />} />
          <Route path="/home"          element={<Home />} />
          <Route path="/account"       element={<Account />} />
          <Route path="/history"       element={<History />} />
          <Route path="/zone"          element={<Zone />} />
          <Route path="/customer"      element={<Customer />} />
          <Route path="/homeclient"    element={<HomeClient />} />
          <Route path="/accountclient" element={<AccountClient />} />
          <Route path="/historyclient" element={<HistoryClient />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="*"              element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
