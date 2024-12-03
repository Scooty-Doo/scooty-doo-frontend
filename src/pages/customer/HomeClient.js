import React, { useState } from 'react';
import MapView from '../../components/Map.js';

const HomeClient = () => {
    const [bikeId, setBikeId] = useState('');
    // Definierar ett state för att hålla cykelns ID
    // Definera om resan är igång eller inte

    // Funktion för att hantera form submission
    const handleSubmit = (e) => {
        e.preventDefault();  // Förhindrar att sidan laddas om vid form submission
        console.log("Cykel ID skickades:", bikeId);  // Här kan du göra något med cykelns ID, som att skicka det till en server
        // Här kan du exempelvis lägga till en funktion för att skicka ID till en API eller server
    };

    return (
        <div>
            <h1>Home for client</h1>
            
            {/* Cykel ID formulär */}
            <h2>Starta resa</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="bikeId">Ange cykelns ID:</label>
                <input 
                    type="text" 
                    id="bikeId" 
                    value={bikeId} 
                    onChange={(e) => setBikeId(e.target.value)}  // Uppdaterar state när användaren skriver
                    placeholder="Exempel: 1234"
                    required
                />
                <button type="submit">Starta resa</button>
            </form>
            
            <MapView />
        </div>
    );
};

export default HomeClient;
