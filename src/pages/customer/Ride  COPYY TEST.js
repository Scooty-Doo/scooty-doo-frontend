import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../../styles/HistoryRideClient.module.css";

// Funktion för att hämta resa från API
const fetchRide = async (rideId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/v1/trips/${rideId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const ridehistory = await response.json();
      console.log("Resa hämtad", ridehistory);
      return ridehistory; // Skicka tillbaka datan för att kunna sätta den i state
    } else {
      console.error("Misslyckades att hämta resa, status:", response.status);
    }
  } catch (error) {
    console.error("Fel vid hämtning av resa:", error);
  }
};

const Ridehistory = () => {
  const { tripId } = useParams();  // Hämta tripId från URL
  const [rideHistory, setRideHistory] = useState(null);

  // Hämta tid
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, "0")}.${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Hämta resa när tripId finns
  useEffect(() => {
    if (tripId) {
      fetchRide(tripId).then((data) => {
        setRideHistory(data);  // Uppdatera state med data från API
      });
    }
  }, [tripId]);

  if (!rideHistory) {
    return <div>Laddar resa...</div>;  // Visa en loading-state om data inte har hämtats än
  }

  return (
    <div className={styles.historyContainer}>
      <h2>Din resa</h2>

      <div className={styles.rideDetails}>
          <p><strong>{new Date(rideHistory.data.attributes.start_time).toLocaleDateString()},  {formatTime(rideHistory.data.attributes.start_time)} - {formatTime(rideHistory.data.attributes.end_time)}</strong></p>
      </div>

      <div className={styles.rideDetails}>
        <p><strong>Pris:</strong> {rideHistory.data.attributes.total_fee} kr</p>
      </div>
    </div>
  );
};

export default Ridehistory;
