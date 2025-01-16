import React, { useState, useEffect } from 'react';
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeClient.module.css';
import { useNavigate } from 'react-router-dom';
import { startRide, endRide } from '../../api/tripsApi'; 
import { fetchUser } from "../../api/meApi";

// Hemsida för klient, där kund kan starta resa
const HomeClient = () => {
    // State för att hålla koll på cykelns-ID, tripId, RideActive
    const [bikeId, setBikeId] = useState('');
    const [tripId, setTripId] = useState(null);
    const [rideActive, setRideActive] = useState(false); 
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    console.log(sessionStorage)
    
    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const getUserInfo = async () => {
            const token = sessionStorage.getItem("token");
            try {
                const userData = await fetchUser(token);
                const formattedData = {
                    name: userData.data.attributes.full_name,
                    email: userData.data.attributes.email,
                    use_prepay: userData.data.attributes.use_prepay,
                    wallet: userData.data.attributes.balance
                };
                setUserInfo(formattedData); // Uppdatera state
            } catch (error) {
                console.error("Error fetching user info:", error);
                alert("Kunde inte hämta användarinformation.");
            }
        };

        getUserInfo();
    }, []);

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
            console.log("Resa avslutad!", response);
            setRideActive(false);
            setBikeId('');
            //navigate(`/ridehistory/`); med response
            navigate('/ridehistory', { state: { rideData: response } }); //skicka med resan till ridehistory
        } catch (error) {
            console.error("Failed to end ride:", error);
        }
    };

    return (
        <div className={styles.homecontaianer}>

            <div className={styles.map}>
                <MapView 
                    userType="client"
                    onBikeClick={(id) => {
                        setBikeId(id); // Fyll i cykelns ID i formuläret
                    }}
                />
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
                    {userInfo?.use_prepay && userInfo?.wallet < 0 ? (
                        <button 
                            onClick={() => navigate('/accountclient')} 
                            className={styles.rechargeButton}
                        >
                            Fyll på ditt saldo innan du kan starta resa
                        </button>
                    ) : (
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
                    )}
                </div>
            )}
        </div>
    );
}

export default HomeClient;
