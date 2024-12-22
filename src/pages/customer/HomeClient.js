import React, { useState } from 'react';
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeClient.module.css';
import { useNavigate } from 'react-router-dom';

// Hemsida för klient, där kund kan starta resa
const HomeClient = () => {
    // State för att hålla koll på cykelns-ID
    const [bikeId, setBikeId] = useState('');

    // State för att kolla om användaren har en resa igång
    const [rideActive, setRideActive] = useState(false); 

    const navigate = useNavigate();

    // Hanterar start av resa (ändra sen till api)
    const handleSubmit = async (e) => {
        e.preventDefault();

        /*
        const response = await fetch('http://127.0.0.1:8000/v1/trips/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id": "652134919185249719",
                "bike_id": "1"
            }),
        });

        if (response.ok) {
            const trip = await response.json();
            console.log("Resa startad", trip);
            setRideActive(true);
        }*/

        console.log("Resa startad");
        setRideActive(true);
    };

       // Hantera avslutning av resa (ändra sen till api)
       const handleEndRide = async (e) => {
        e.preventDefault();

        console.log("Resa avslutad!");
        setRideActive(false);
        setBikeId('');

        navigate(`/ridehistory`);
    };

    return (
        <div className={styles.homecontaianer}>

            <div className={styles.map}>
                <MapView />
            </div>

                {rideActive ? (
                <div className={styles.formcontainer}>
                        <h2>Resa igång</h2>
                        <button onClick={handleEndRide} className={styles.endButton}>
                            Avsluta resa
                        </button>
                </div>
                ) : (
                    <div className={styles.formcontainer}>
                        <h2>Starta din resa</h2>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                id="bikeId" 
                                value={bikeId} 
                                onChange={(e) => setBikeId(e.target.value)}
                                placeholder="Ange cykelns ID"
                                required
                            />
                            <button type="submit">Start</button>
                        </form>
                    </div>
                )}
            </div>
    );
}

export default HomeClient;
