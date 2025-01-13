import React, { useState, useEffect } from "react";
import styles from "../../styles/HistoryClient.module.css";
import { Link } from "react-router-dom";
import { fetchUserTrips } from "../../api/userApi";

const HistoryClient = () => {
    const user_id = 1; // ID för användaren
    const [userTrips, setUserTrips] = useState([]); // Initiera som tom array
    const [loading, setLoading] = useState(true); // Hantera laddningstillstånd
    const [error, setError] = useState(null); // Hantera fel

    const mapIconUrl = "https://img.icons8.com/?size=100&id=8212&format=png&color=2C3E50";

    useEffect(() => {
        const getUserTrips = async () => {
            try {
                const data = await fetchUserTrips(user_id); // Hämta resor
                setUserTrips(data.data); // Sätt resorna i state
            } catch (err) {
                console.error("Error fetching user trips:", err);
                setError("Kunde inte hämta resor.");
            } finally {
                setLoading(false); // Sätt laddningstillstånd till falskt
            }
        };

        getUserTrips();
    }, [user_id]);

    // Formatera tid
    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
        });
    };
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
        });
    };
    

    if (loading) {
        return <div className={styles.historyContainer}>Laddar resor...</div>;
    }

    if (error) {
        return <div className={styles.historyContainer}>{error}</div>;
    }

    return (
        <div className={styles.historyContainer}>
            <h1>Historik</h1>
            <div className={styles.historyList}>
                {userTrips.map((trip, index) => (
                    <div key={index} className={styles.rideItem}>
                        <div className={styles.rideDetails}>
                            {/* Lägg till kartikonen */}
                            <img src={mapIconUrl} alt="Map Icon" className={styles.mapIcon} />
                            {/* Länk till resans historik */}
                            <p className={styles.date}>
                                <strong>
                                    <Link to={`/ridehistory/${trip.id}`}>
                                        {formatDate(trip.attributes.start_time)}
                                    </Link>
                                </strong>
                            </p>

                            {/* Visning av resans detaljer */}
                            <p>
                                <strong>Tid:</strong> {`${formatTime(trip.attributes.start_time)} - ${formatTime(trip.attributes.end_time)}`}
                            </p>

                            <p>
                                <strong>Pris:</strong> {trip.attributes.total_fee} kr
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryClient;
