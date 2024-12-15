import React, { useState } from 'react';
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeClient.module.css';

// Hemsida för klient, där kund kan starta resa
const HomeClient = () => {
    // State för att hålla koll på cykelns-ID
    const [bikeId, setBikeId] = useState('');

    // State för att kolla om användaren har en resa igång
    const [rideActive, setRideActive] = useState(false); 

    // Hanterar start av resa (ändra sen till api)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Cykel ID skickades:", bikeId);
        setRideActive(true);
    };

    // Hantera avslutning av resa (ändra sen till api)
    const handleEndRide = () => {
        console.log("Resa avslutad!");
        setRideActive(false); // Avsluta resan
        setBikeId(''); // Återställ cykel-ID
    };

    return (
        <div className={styles.homecontaianer}>

            <div className={styles.map}>
                <MapView />
            </div>

                {rideActive ? (
                <div className={styles.formcontainer}>
                    <h2 className={styles.quote}> Start your scooty doo ride!</h2>
                        <h2>Ride in progress</h2>
                        <button onClick={handleEndRide} className={styles.endButton}>
                            Avsluta resa
                        </button>
                </div>
                ) : (
                    <div className={styles.formcontainer}>
                    <h2 className={styles.quote}> Start your scooty doo ride!</h2>
                        <h2>Activate your bike</h2>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                id="bikeId" 
                                value={bikeId} 
                                onChange={(e) => setBikeId(e.target.value)}
                                placeholder="Bike ID"
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
