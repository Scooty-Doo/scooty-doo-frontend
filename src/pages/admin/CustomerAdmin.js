import React, { useState, useEffect } from 'react';
import { fetchUser, fetchUserTrips, userDetails2 } from "../../api/userApi";
import TripsList from '../../components/TripsList'; // Import the TripsList component

// Vad ska admin Customer-CRUD kunna göra?
// Read:
// Admin ska kunna läsa kundens konto detaljer och kundens trips/transactions
// (antar vi visar trips/transactions i en listvy där högst up i listan är den nyaste)
// Visa trips / transactions listorna för selectad kund genom en knapp under formen
// Vad för update ska admin kunna göra?
// Admin ska kunna ändra:
// Username? == yes
// Email? == maybe (hold)
// Balance? == yes (keep simple for now)
// created at? == no
// updated at? == no
// use prepay? == yes
// profile link? == no
// ska admin bara kunna se användarets konton?
// i ett mer utförligt system skulle admin kunna ge en chargeback om kundens pengar dras fel


const Customer = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);
    const [trips, setTrips] = useState([]);
    const [showTrips, setShowTrips] = useState(false);
    const customerId = 652134919185249768n;

    // Fetch Customer details
    useEffect(() => {
        if (customerId) {
            fetchUser(customerId).then((data) => {
                setCustomer(data);
            });
        }
        // fetchUser();
    }, [customerId]);

    // Handle the loading state if customer is not set
    useEffect(() => {
        if (!customer) {
            setLoading(false);
        }
    }, [customer]);


    const handleShowTrips = () => {
        setShowTrips(!showTrips);
        if (!showTrips) {
            fetchUserTrips(customerId).then((data) => {
                setTrips(data);
            });
        }
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setCustomer((prevCustomer) => {
            // Creates a shallow copt of the customer data
            const updatedCustomer = { ...prevCustomer };

            // Finds and updates the corresponding value in customer
            if (name === 'full_Name') {
                updatedCustomer.data.attributes.full_name = newValue;
            } else if (name === 'email') {
                updatedCustomer.data.attributes.email = newValue;
            } else if (name === 'use_prepay') {
                updatedCustomer.data.attributes.use_prepay = newValue;
            }

            // Returns the updatedCustomer
            console.log("Handle Change",updatedCustomer);
            return updatedCustomer;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page refresh on submit
        console.log("on submit",JSON.stringify(customer)); // debugging

        // Load the variables with user info for readability
        const full_name = customer.data.attributes.full_name;
        const email = customer.data.attributes.email;
        const github_login = customer.data.attributes.github_login;
        const use_prepay = customer.data.attributes.use_prepay;

        try {
            await userDetails2(customerId, full_name, email, github_login, use_prepay);
            console.log("Account Info Saved");
        } catch (error) {
            console.log("Error submitting customer data:", error)
        }
    };

    // Handling loading state
    if (loading) {
        return <p>Loading user data...</p>;
    }

    // Handling error state
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                Full Name
                    <input
                        type="text"
                        id="full_Name"
                        name="full_Name"
                        value={customer?.data?.attributes?.full_name  ?? ''}
                        onChange={handleChange} />
                </label>
                <label>
                Email
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={customer?.data?.attributes?.email  ?? ''}
                        onChange={handleChange} />
                </label>
                <label>
                Password
                    <input
                        type="text"
                        id="profile_link"
                        name="profile_link"
                        value={customer?.data?.attributes?.github_login  ?? ''}
                        readOnly />
                </label>
                <label>
                Balance kr
                    <input
                        type="text"
                        id="balance"
                        name="balance"
                        value={customer?.data?.attributes?.balance  ?? ''}
                        readOnly />
                </label>
                <label>
                Created At
                    <input
                        type="text"
                        id="created_at"
                        name="created_at"
                        value={customer?.data?.attributes?.created_at  ?? ''}
                        readOnly />
                </label>
                <label>
                Updated At
                    <input
                        type="text"
                        id="updated_at"
                        name="updated_at"
                        value={customer?.data?.attributes?.updated_at  ?? ''}
                        readOnly />
                </label>
                <div>
                    <label>
                    Use Prepay
                        <input
                            type="checkbox"
                            id="use_prepay"
                            name="use_prepay"
                            checked={customer?.data?.attributes?.use_prepay ?? false}
                            onChange={handleChange} />
                    </label>
                </div>
                <label>
                Profile Link
                    <input
                        type="text"
                        id="profile_link"
                        name="profile_link"
                        value={customer?.data?.links?.self  ?? ''}
                        readOnly />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <button onClick={handleShowTrips}>Show Trips</button>
            {showTrips && <TripsList trips={trips} />}
        </div>
    );
};

export default Customer;
