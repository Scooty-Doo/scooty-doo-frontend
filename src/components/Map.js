import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
    return (
        <MapContainer 
            center={[55.604981, 13.003822]} // Där kartan centreras just nu (malmös koordinater)
            zoom={15}  // Zoomnivå, ju högre desto mer inzoomad
            style={{ height: "400px", width: "80%" }}  // Kartans storlek på sidan
        >
        
        <TileLayer
            // Importerade en annan kartstyle via thunderforest
            url="https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=b50533aeae574d949113dae3897804bc"
            attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
        />
        </MapContainer>
    );
};

export default MapView;
