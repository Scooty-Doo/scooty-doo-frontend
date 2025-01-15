import React, { useState, useEffect } from 'react';
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeClient.module.css';
import { useNavigate } from 'react-router-dom';
import { startRide, endRide } from '../../api/tripsApi'; 

// Hemsida för klient, där kund kan starta resa
const HomeClient = () => {
    // State för att hålla koll på cykelns-ID, tripId, RideActive
    const [bikeId, setBikeId] = useState('');
    const [tripId, setTripId] = useState(null);
    const [rideActive, setRideActive] = useState(false); 

    const navigate = useNavigate();
    
    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    // Hanterar start av resa (ändra sen till api)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const trip = await startRide(bikeId);
            console.log("Resa startad", trip);
            setTripId(trip.data.id);
            setRideActive(true);
        } catch (error) {
            console.error("Failed to start ride:", error);
        }
    };

    const handleEndRide = async () => {
        try {
            await endRide(tripId, bikeId);
            console.log("Resa avslutad!");
            setRideActive(false);
            setBikeId('');
            navigate(`/ridehistory/${tripId}`);
        } catch (error) {
            console.error("Failed to end ride:", error);
        }
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
                    <form aria-label="trip-form" onSubmit={handleSubmit}>
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
