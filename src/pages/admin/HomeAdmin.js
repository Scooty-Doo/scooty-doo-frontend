import React, { useEffect, useState } from 'react';
import ListBikeCity from '../../components/ListBikeCity'; // Import the ListBikeCity component som har sök funktionalitet
import MapAdmin from '../../components/MapAdmin.js';
import styles from '../../styles/HomeAdmin.module.css';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const HomeAdmin = ({token}) => {
    const navigate = useNavigate();
    const [selectedBikePoint, setSelectedBikePoint] = useState(null);
    // Kontrollera token och omdirigera till login om den saknas
    useEffect(() => { // lägg till i alla admin sidor!
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    token = sessionStorage.getItem("token");
    console.log("session Storage",sessionStorage);
    console.log("Token direkt",token);
    const URL = process.env.NODE_ENV === 'production' ? "http://127.0.0.1:8000" : 'http://127.0.0.1:8000';
    const socket = io(URL);
    socket.connect();
    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <MapAdmin
                    userType={"admin"}
                    socket={socket}
                    token={token}
                    selectedBikePoint={selectedBikePoint} // Ge selectedBikePoint till MapAdmin
                />
            </div>
            <div className={styles.list}>
                <ListBikeCity
                    onBikePointClick={setSelectedBikePoint} // Updatera selectedBikePoint state
                />
            </div>
        </div>
    );
};

export default HomeAdmin;

HomeAdmin.propTypes = {
    token: PropTypes.string
};
