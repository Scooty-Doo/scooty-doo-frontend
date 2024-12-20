import React from 'react';
import ListBike from '../../components/ListBike'; // Import the ListBike component
import ListBikeCity from '../../components/ListBikeCity'; // Import the ListBikeCity component som har sök funktionalitet
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeAdmin.module.css';


const HomeAdmin = () => {
    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <MapView />
            </div>
            <div className={styles.list}>
                <ListBikeCity />
            </div>
        </div>
        );
    };

export default HomeAdmin;
