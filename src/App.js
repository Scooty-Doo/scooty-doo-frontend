import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, useLocation, HashRouter } from 'react-router-dom';

// Import for components
import Navbar from './components/Navbar';
import NavbarClient from './components/NavbarClient';

// Components for admin
import Home     from './pages/admin/HomeAdmin';
import Account  from './pages/admin/AccountAdmin';
import History  from './pages/admin/HistoryAdmin';
import Zone     from './pages/admin/ZoneAdmin';
import Customer from './pages/admin/CustomerAdmin';
import BikeCRUDAdmin from './pages/admin/BikeCRUDAdmin';
import CustomerUpdate from './pages/admin/CustomerUpdate';

// Components for customer
import HomeClient     from './pages/customer/HomeClient';
import AccountClient  from './pages/customer/AccountClient';
import HistoryClient  from './pages/customer/HistoryClient';
import LoginClient    from './pages/customer/LoginClient';
import Ride from './pages/customer/Ride';

// Components for Oauth
import GitHubLogin    from './pages/oauth/GitHubLogin';


// Define layout with dynamic Navbar
const Layout = ({ children }) => {
    const location = useLocation();

    // Define when to show which Navbar or none
    let navbar = null;
    if (location.pathname.startsWith('/homeclient') || 
      location.pathname.startsWith('/accountclient') || 
      location.pathname.startsWith('/ridehistory') || 
      location.pathname.startsWith('/historyclient')) {
        navbar = <NavbarClient />;
    } else if (
        location.pathname.startsWith('/home') || 
    location.pathname.startsWith('/account') || 
    location.pathname.startsWith('/history') ||
    location.pathname.startsWith('/zone') ||
    location.pathname.startsWith('/bikeCRUD') ||
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

Layout.propTypes = {
    children: PropTypes.node  // Validera children som en React node
};

const App = () => {
    const basename = process.env.NODE_ENV === 'production' ? "" : "";

    return (
        <HashRouter>
            <Layout>
                {/* Define Routes */}
                <Routes>
                    <Route path="/"              element={<LoginClient basename={basename} />} />
                    <Route path="/home"          element={<Home/>} />
                    <Route path="/account"       element={<Account />} />
                    <Route path="/history"       element={<History />} />
                    <Route path="/customerupdate/:userId"       element={<CustomerUpdate />} />
                    <Route path="/zone"          element={<Zone />} />
                    <Route path="/customer"      element={<Customer />} />

                    <Route path="/bikeCRUD" element={<h1>Please select a bike to view its details.</h1>} />
                    <Route path="/bikeCRUD/:bikeId" element={<BikeCRUDAdmin />} />

                    <Route path="/homeclient"    element={<HomeClient />} />
                    <Route path="/accountclient" element={<AccountClient/>} />

                    <Route path="/historyclient" element={<HistoryClient />} />
                    <Route path="/ridehistory/:tripId" element={<Ride />} />
                    <Route path="/githublogin"   element={<GitHubLogin/>} />
                    <Route path="*"              element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </Layout>
        </HashRouter>
    );
};

export default App;
