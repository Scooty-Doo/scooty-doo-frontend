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
        <div className={styles.container}>
            <h1 className={styles.title}>Hem</h1>
            <div className={styles.map}>
                <MapView />
            </div>
            <div className={styles.formcontainer}>
                <h2>Starta resa</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        id="bikeId" 
                        value={bikeId} 
                        onChange={(e) => setBikeId(e.target.value)}
                        placeholder="Ange Cykelns ID"
                        required
                    />
                    <button type="submit">Starta resa</button>
                </form>
            </div>
        </div>
    );
};

export default HomeClient;
