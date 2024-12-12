import React, { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Wkt from 'wicket'; // Wicket för att kunna hantera WKT-strängar från backend
import L from 'leaflet';  // Importera Leaflet för att skapa en anpassad ikon

const MapView = ({ userType }) => {
    const [bikes, setBikes] = useState([]); // State för att hålla cyklarna
    const [loading, setLoading] = useState(true); // State för att hantera laddning
    const [zones, setZones] = useState([]); // State för att hålla zonerna

    // Skapa en anpassad ikon för markörerna
    const bikeIcon = new L.Icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=OLbgdgI722qP&format=png&color=000000',
        iconSize: [32, 32],  // Storleken på ikonen
        iconAnchor: [16, 32],  // Placeringen av ikonen (centrum av ikonen)
        popupAnchor: [0, -32],  // Placeringen av popup-fönstret relativt ikonen
    });

    // Hämtar cyklar från API
    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/v1/bikes'); // API-anrop
                const data = await response.json();
                console.log("Bikes:", data.data); //debug-logg
                setBikes(data.data); // Uppdatera cykel-state
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bikes:", error);
                setLoading(false);
            }
        };

        const fetchZones = async () => {
            try {
                const response = await fetch ('http://127.0.0.1:8000/v1/zones'); // API-anrop
                const data = await response.json();
                setZones(data.data);
                console.log("Zones", data.data);
            } catch(error) {
                console.error("Error fetching zones:", error);
            }
        };

        fetchBikes();
        fetchZones();
    }, []);

    // Färger för olika zonerna
    const zoneColors = {
        Parking: "blue",
        Charging: "green",
        Forbidden: "red",
        Slow: "orangge",
    };

    // 

    return (
        <MapContainer 
            center={[55.604981, 13.003822]}  // Malmö
            zoom={15}  // Zoomnivå
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=b50533aeae574d949113dae3897804bc"
                attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
            />

            {/* Lägg till markörer med anpassad ikon */}
            {bikes.map((bike) => {
                console.log("Bike position:", bike.position);
                return (
                    <Marker key={bike.id} position={bike.position} icon={bikeIcon}>
                        <Popup>
                            {bike.name} är här!
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapView;
