import React from 'react';
import ListBike from '../../components/ListBike'; // Import the ListBike component
import ListBikeCity from '../../components/ListBikeCity'; // Import the ListBikeCity component som har sök funktionalitet
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeAdmin.module.css';
import { io } from 'socket.io-client';

const HomeAdmin = () => {
    const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
    const socket = io(URL);
    socket.connect();

    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <MapView userType={"admin"} socket={socket} />
            </div>
            <div className={styles.list}>
                <ListBikeCity />
            </div>
        </div>
        );
    };

export default HomeAdmin;
