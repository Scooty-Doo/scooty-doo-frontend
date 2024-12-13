import React, { useState } from 'react';
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeClient.module.css';

// Hemsida för klient, där kund kan starta resa
const HomeClient = () => {
    // State för att hålla koll på cykelns-ID
    const [bikeId, setBikeId] = useState('');

    // Hanterar formulär och loggar cykel-ID
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Cykel ID skickades:", bikeId);
    };

    return (
        <div className={styles.homecontaianer}>
            <div className={styles.map}>
                <MapView />
            </div>
            <div className={styles.formcontainer}>
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
        </div>
    );
};

export default HomeClient;
