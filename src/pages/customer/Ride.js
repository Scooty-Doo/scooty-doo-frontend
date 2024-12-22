import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../../styles/HistoryRideClient.module.css";
import Wkt from "wicket"; // Importera Wicket
import "wicket/wicket-leaflet";

// Funktion för att hämta resa från API
const fetchRide = async (rideId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/v1/trips/${rideId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const ridehistory = await response.json();
      console.log("Resa hämtad", ridehistory);
      console.log(ridehistory.data.attributes.path_taken);
      return ridehistory; // Skicka tillbaka datan för att kunna sätta den i state
    } else {
      console.error("Misslyckades att hämta resa, status:", response.status);
    }
  } catch (error) {
    console.error("Fel vid hämtning av resa:", error);
  }
};

// Funktion för att omvandla LINESTRING till koordinater
const parsePath = (pathWKT) => {
  try {
    const wicket = new Wkt.Wkt();
    wicket.read(pathWKT);

    // Get coordinates and swap lat/lng for Leaflet
    return wicket.toJson().coordinates.map(([lng, lat]) => [lat, lng]);
  } catch (error) {
    console.error("Error parsing path:", error);
    return [];
  }
};

const Ridehistory = () => {
  const { tripId } = useParams(); // Hämta tripId från URL
  const [rideHistory, setRideHistory] = useState(null);

  // Hämta tid
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, "0")}.${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Hämta resa när tripId finns
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

  // Omvandla path_taken till koordinater
  const pathCoordinates = parsePath(rideHistory.data.attributes.path_taken);

  return (
    <div className={styles.historyContainer}>
      <h2>Din resa</h2>

      <div className={styles.rideDetails}>
        <p>
          <strong>
            {new Date(
              rideHistory.data.attributes.start_time
            ).toLocaleDateString()}
            , {formatTime(rideHistory.data.attributes.start_time)} -{" "}
            {formatTime(rideHistory.data.attributes.end_time)}
          </strong>
        </p>
      </div>

      <div className={styles.mapContainer}>
        <MapContainer
          center={pathCoordinates[0] || [0, 0]} // Startposition
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline positions={pathCoordinates} color="blue" />
        </MapContainer>
      </div>

      <div className={styles.rideDetails}>
        <p>
          <strong>Pris:</strong> {rideHistory.data.attributes.total_fee} kr
        </p>
      </div>
    </div>
  );
};

export default Ridehistory;
