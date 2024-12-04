import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';  // Importera Leaflet för att skapa en anpassad ikon

const MapView = ({ userType }) => {
    // Lista med cyklar och deras koordinater
    const bikes = [
        { id: 1, position: [55.604981, 13.003822], name: "Cykel 1" },
        { id: 2, position: [55.605881, 13.004922], name: "Cykel 2" },
        { id: 3, position: [55.606781, 13.005722], name: "Cykel 3" },
    ];

    // Skapa en anpassad ikon för markörerna
    const bikeIcon = new L.Icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=OLbgdgI722qP&format=png&color=000000',
        iconSize: [32, 32],  // Storleken på ikonen
        iconAnchor: [16, 32],  // Placeringen av ikonen (centrum av ikonen)
        popupAnchor: [0, -32],  // Placeringen av popup-fönstret relativt ikonen
    });

    // Koordinater och radie för den förbjudna zonen (kan vara vilken plats du vill)
    const forbiddenAreaCenter = [55.605, 13.004];  // Mittpunkt för den förbjudna zonen
    const forbiddenAreaRadius = 100;  // Radie i meter

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
            {bikes.map((bike) => (
                <Marker key={bike.id} position={bike.position} icon={bikeIcon}>
                    <Popup>
                        {bike.name} är här!
                    </Popup>
                </Marker>
            ))}

            {/* Lägg till den förbjudna zonen som en röd cirkel */}
            <Circle
                center={forbiddenAreaCenter}
                radius={forbiddenAreaRadius}
                color="red"
                fillColor="red"
                fillOpacity={0.4}
            />
        </MapContainer>
    );
};

export default MapView;
