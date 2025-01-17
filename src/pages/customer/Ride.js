import React, { useState, useEffect } from "react";
//import { useParams } from "react-router-dom";
//import { fetchRide } from "../../api/tripsApi";
import { useNavigate, useLocation } from "react-router-dom";
import { parsePath, formatTime } from "../../components/utils"; // Import helpers
import RideDetails from "../../components/RideDetails";
import MapRide from "../../components/MapRide";
import styles from "../../styles/HistoryRideClient.module.css";
import { fillWallet } from "../../api/stripeApi";
import { fetchTrip } from "../../api/tripsApi";

const Ridehistory = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const [rideHistory, setRideHistory] = useState(null);
    const [amount, setAmount] = useState(0);
    const [isFetchedViaId, setIsFetchedViaId] = useState(false);
    const navigate = useNavigate();

    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const loadRideData = async () => {
            try {
                // Kontrollera om `location.state.ride` finns
                if (location.state?.ride) {
                    setRideHistory(location.state.ride);
                    setIsFetchedViaId(false);
                } else if (tripId) {
                    // Hämta resa via API om `location.state.ride` inte finns
                    const rideData = await fetchTrip(tripId);
                    setRideHistory(rideData);
                    setIsFetchedViaId(true);
                } else {
                    console.error("Ingen resa tillgänglig");
                }
            } catch (error) {
                console.error("Failed to load ride data:", error);
            }
        };

        loadRideData();
    }, [location, tripId]);

    useEffect(() => {
        if (!rideHistory) {
            return
        }
        console.log(rideHistory)
        const totalFee = rideHistory.data.attributes.total_fee;
        const roundedAmount = Math.ceil(totalFee); // Avrunda uppåt
        setAmount(roundedAmount); // Sätt det som ett heltal  
    }, [rideHistory])


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
            {!isFetchedViaId && ( // Visa knappen endast om resan inte hämtades via ID
                <button onClick={handleSubmit} className={styles.Paybutton}>
                    Betala din resa nu
                </button>
            )}
            <button className={styles.newRide}>Boka en ny cykel</button>
        </div>
    );
};

export default Ridehistory;
