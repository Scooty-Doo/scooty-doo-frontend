import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRide } from "../../api/tripsApi";
import { parsePath, formatTime } from "../../components/utils"; // Import helpers
import RideDetails from "../../components/RideDetails";
import MapRide from "../../components/MapRide";
import styles from "../../styles/HistoryRideClient.module.css";
import { fillWallet } from "../../api/stripeApi";

const Ridehistory = () => {
    const { tripId } = useParams();
    const [rideHistory, setRideHistory] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (tripId) {
            fetchRide(tripId).then((data) => {
                setRideHistory(data);

                // Hämta total_fee och avrunda uppåt
                const totalFee = data.data.attributes.total_fee;
                const roundedAmount = Math.ceil(totalFee); // Avrunda uppåt
                setAmount(roundedAmount); // Sätt det som ett heltal
            });
        }
    }, [tripId]);

    if (!rideHistory) {
        return <div>Laddar resa...</div>;
    }

    const pathCoordinates = parsePath(rideHistory.data.attributes.path_taken);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fillWallet(amount, window.location.href);
            window.location.href = response.data.url;
        } catch (error) {
            console.error(`Failed to add to wallet. Please try again. Details ${error}`);
        }
    }

    return (
        <div className={styles.historyContainer}>
            <h2>Din resa</h2>

            <RideDetails rideHistory={rideHistory} formatTime={formatTime} />
            <MapRide pathCoordinates={pathCoordinates} />
            <button className={styles.newRide}>Boka en ny cykel</button>
            <button onClick={handleSubmit} className={styles.newRide}>
                Betala din resa nu
            </button>

        </div>
    );
};

export default Ridehistory;
