import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../styles/HistoryRideClient.module.css";

const MapRide = ({ pathCoordinates }) => {

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={pathCoordinates[0] || [0, 0]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline positions={pathCoordinates} color="blue" />
            </MapContainer>
        </div>
    );
};

MapRide.propTypes = {
    pathCoordinates: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number).isRequired
    ).isRequired,
};


export default MapRide;
