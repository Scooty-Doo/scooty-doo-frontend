import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRide } from "../../api/tripsApi";
import { useNavigate } from "react-router-dom";
import { parsePath, formatTime } from "../../components/utils"; // Import helpers
import RideDetails from "../../components/RideDetails";
import MapRide from "../../components/MapRide";
import styles from "../../styles/HistoryRideClient.module.css";

const Ridehistory = () => {
    const { tripId } = useParams();
    const [rideHistory, setRideHistory] = useState(null);
    const navigate = useNavigate();

    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (tripId) {
            fetchRide(tripId).then((data) => {
                setRideHistory(data);
            });
        }
    }, [tripId]);

    if (!rideHistory) {
        return <div>Laddar resa...</div>;
    }

    const pathCoordinates = parsePath(rideHistory.data.attributes.path_taken);

    return (
        <div className={styles.historyContainer}>
            <h2>Din resa</h2>

            <RideDetails rideHistory={rideHistory} formatTime={formatTime} />
            <MapRide pathCoordinates={pathCoordinates} />
            <button className={styles.newRide}>Boka en ny cykel</button>
        </div>
    );
};

export default Ridehistory;
