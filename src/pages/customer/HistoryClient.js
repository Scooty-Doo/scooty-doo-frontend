import React, { useState } from "react";
import styles from "../../styles/HistoryClient.module.css"; // Antag att du skapar en egen CSS-modul
import { Link } from 'react-router-dom';

// Visa tidigare åk för kund
const HistoryClient = () => {
    // Test för tidigare åk
    const [rideHistory] = useState([
        { route: "Malmö-Lund", date: "2024-12-01", time: "12:48", price: "38 SEK" },
        { route: "Lund-Malmö", date: "2024-11-28", time: "08:30", price: "40 SEK" },
        { route: "Stockholm-Göteborg", date: "2024-10-15", time: "16:20", price: "120 SEK" }
    ]);

    const mapicon = { 
        iconurl: 'https://img.icons8.com/?size=100&id=P2ZiVm4SUoJd&format=png&color=000000' 
    };

    return (
        <div className={styles.historyContainer}>
            <h1>Historik</h1>
            <div className={styles.historyList}>
                {rideHistory.map((ride, index) => (
                    <div key={index} className={styles.rideItem}>
                        <div className={styles.rideDetails}>
                            {/* Lägg till ikonen här */}
                            <img 
                                src={mapicon.iconurl} 
                                alt="Map Icon" 
                                className={styles.mapIcon} 
                            />
                            <p><strong>Rutt:</strong> {ride.route}</p>
                            <p><strong>Datum:</strong> {ride.date}</p>

                            <p><strong><Link to="/ridehistory">{ride.date}</Link></strong></p>
                            <p><strong>Tid:</strong> {ride.time}</p>
                            <p><strong>Pris:</strong> {ride.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryClient;
