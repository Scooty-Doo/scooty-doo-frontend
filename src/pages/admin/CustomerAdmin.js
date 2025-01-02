import React, { useState, useEffect } from 'react';
import TripsList from '../../components/TripsList'; // Import the TripsList component

    // Vad ska admin Customer-CRUD kunna göra?
    // Read:
        // Admin ska kunna läsa kundens konto detaljer och kundens trips/transactions
        // (antar vi visar trips/transactions i en listvy där högst up i listan är den nyaste)
        // Visa trips / transactions listorna för selectad kund genom en knapp under formen
    // Vad för update ska admin kunna göra?
        // Admin ska kunna ändra:
        // Username? == no
        // Email? == no
        // Balance? == no
        // created at? == no
        // updated at? == no
        // use prepay? == no
        // profile link? == no
        // ska admin bara kunna se användarets konton?
            // i ett mer utförligt system skulle admin kunna ge en chargeback om kundens pengar dras fel


const Customer = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trips, setTrips] = useState([]);
    const [showTrips, setShowTrips] = useState(false);
    const customerId = 652134919185249768;

    // Fetch Customer details
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`http://localhost:8000/v1/users/${customerId}`); // ändra till en variable av länken i customer objektet?
                if (!response.ok) throw new Error('Failed to fetch customer details');
                const data = await response.json();
                console.log("Fetch debug log",data); // temporary log for debugging
                setCustomer(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    const fetchTrips = async () => {
        try {
            const response = await fetch(`http://localhost:8000/v1/users/${customerId}/trips`);
            if (!response.ok) throw new Error('Failed to fetch trips');
            const data = await response.json();
            console.log("Trips fetch",data); // temporary log for debugging
            setTrips(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShowTrips = () => {
        setShowTrips(!showTrips);
        if (!showTrips) fetchTrips();
    };

    // Handling loading state
    if (loading) {
        return <p>Loading user data...</p>;
    }

    // Handling error state
    if (error) {
        return <p>Error: {error}</p>;
    }

    const { attributes, links } = customer.data;
    return (
        <div>
            <form>
            <label>
                Full Name
                <input type="text" value={attributes.full_name} readOnly />
            </label>
            <label>
                Email
                <input type="text" value={attributes.email} readOnly />
            </label>
            <label>
                Balance kr
                <input type="text" value={attributes.balance} readOnly />
            </label>
            <label>
                Created At
                <input type="text" value={attributes.created_at} readOnly />
            </label>
            <label>
                Updated At
                <input type="text" value={attributes.updated_at} readOnly />
            </label>
            <label>
                Use Prepay
                <input type="text" value={attributes.use_prepay ? "Yes" : "No"} readOnly />
            </label>
            <label>
                Profile Link
                <input type="text" value={links.self} readOnly />
            </label>
            </form>
            <button onClick={handleShowTrips}>Show Trips</button>
            {showTrips && <TripsList trips={trips} />}
        </div>
      );
    };

export default Customer;
