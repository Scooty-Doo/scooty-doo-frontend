import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parsePath, formatTime } from "../../components/utils"; // Import helpers
import RideDetails from "../../components/RideDetails";
import MapRide from "../../components/MapRide";
import styles from "../../styles/HistoryRideClient.module.css";
import { fillWallet } from "../../api/stripeApi";

const Ridehistory = () => {
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    const rideData = location.state?.rideData; //hämta rideData
    console.log("Ride Data:", rideData);

    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);


    useEffect(() => {
        if (rideData) {
            // Hämta total_fee och avrunda uppåt
            const totalFee = rideData.data.attributes.total_fee;
            const roundedAmount = Math.ceil(totalFee); // Avrunda uppåt
            setAmount(roundedAmount); // Sätt det som ett heltal
        }
    }, [rideData]);

    if (!rideData) {
        return <div>Ingen data tillgänglig för denna resa.</div>;
    }

    const pathCoordinates = parsePath(rideData.data.attributes.path_taken);

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

            <RideDetails rideHistory={rideData} formatTime={formatTime} />
            <MapRide pathCoordinates={pathCoordinates} />
            <button className={styles.newRide}>Boka en ny cykel</button>
            <button onClick={handleSubmit} className={styles.newRide}>
                Betala din resa nu
            </button>

        </div>
    );
};

export default Ridehistory;
