import React from 'react';
import ListBikeCity from '../../components/ListBikeCity'; // Import the ListBikeCity component som har sök funktionalitet
import MapView from '../../components/Map.js';
import styles from '../../styles/HomeAdmin.module.css';
import { io } from 'socket.io-client';

const HomeAdmin = ({token}) => {
    const URL = process.env.NODE_ENV === 'production' ? "http://127.0.0.1:8000" : 'http://127.0.0.1:8000';
    const socket = io(URL);
    socket.connect();
    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <MapView userType={"admin"} socket={socket} token={token} />
            </div>
            <div className={styles.list}>
                <ListBikeCity />
            </div>
        </div>
    );
};

export default HomeAdmin;

HomeAdmin.propTypes = {
    token: PropTypes.string
};
