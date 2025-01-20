import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/HistoryClient.module.css";
import { Link } from "react-router-dom";
import { fetchUserTrips } from "../../api/meApi";

const HistoryClient = () => {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]); // Initiera som tom array
    const [loading, setLoading] = useState(true); // Hantera laddningstillstånd
    const [error, setError] = useState(null); // Hantera fel

    const mapIconUrl = "https://img.icons8.com/?size=100&id=8212&format=png&color=2C3E50";

    const token = sessionStorage.getItem("token");
    console.log(token);
    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    
    useEffect(() => {
        const getUserTrips = async () => {
            console.log("Anropar fetchUserTrips...");
            try {
                const data = await fetchUserTrips(); // Hämta resor
                console.log("Data från API:", data);
                setUserTrips(data.data); // Sätt resorna i state
            } catch (err) {
                console.error("Error fetching user trips:", err);
                setError("Kunde inte hämta resor.");
            } finally {
                setLoading(false);
            }
        };
    
        getUserTrips();
    }, []);
    

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
                            <img src={mapIconUrl} alt="Map Icon" className={styles.mapIcon} />
                            <p className={styles.date}>
                                <strong>
                                    {formatDate(trip.attributes.start_time)}
                                </strong>
                            </p>
                            <p>
                                <Link
                                    to={`/ridehistory/${trip.id}`}
                                >
                                    <strong>Tid:</strong> {`${formatTime(trip.attributes.start_time)} - ${formatTime(trip.attributes.end_time)}`}
                                </Link>
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
