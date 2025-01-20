import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ListBikeCity.module.css';
import { fetchBikeByCityApi, fetchBike } from "../api/bikeApi";
import PropTypes from "prop-types";

const ListBikeCity = ({ onBikePointClick }) => {
    const [bikes, setBikes] = useState([]);
    const [cityId, setCityId] = useState('');
    const [bikeId, setBikeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBikesByCity = () => {
        if (!cityId) return;
        setLoading(true);
        setError(null);

        console.log("city Id is", cityId);
        fetchBikeByCityApi(cityId).then((data) => {
            setBikes(data.data);
            setLoading(false);
        })
            .catch((error) => {
                setError(`Error loading bikes: ${error.message}`);
                setLoading(false);
            });
    };

    const fetchBikeById = () => {
        if (!bikeId) return;
        setLoading(true);
        setError(null);

        console.log("city Id is", cityId);
        fetchBike(bikeId).then((data) => {
            setBikes([data.data]);
            setLoading(false);
        })
            .catch((error) => {
                setError(`Error loading bikes: ${error.message}`);
                setLoading(false);
            });
    };

    return (
        <div>
            <div className={styles.searchSection}>
                <h2 className={styles.title}>Bikes List</h2>
                
                <div className={styles.searchGroup}>
                    <input
                        className={styles.input}
                        type="number"
                        placeholder="Enter City ID"
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                    />
                    <button className={styles.button} onClick={fetchBikesByCity}>
                        Search by City ID
                    </button>
                </div>

                <div className={styles.searchGroup}>
                    <input
                        className={styles.input}
                        type="number"
                        placeholder="Enter Bike ID"
                        value={bikeId}
                        onChange={(e) => setBikeId(e.target.value)}
                    />
                    <button className={styles.button} onClick={fetchBikeById}>
                        Search by Bike ID
                    </button>
                </div>
            </div>


            {loading && <p>Loading bikes...</p>}
            {error && <p>Error loading bikes: {error.message}</p>}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Bike ID</th>
                            <th>Battery Level</th>
                            <th>Last Position</th>
                            <th>Availability</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>City ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bikes.map((bike) => (
                            <tr key={bike.id}>
                                <td><Link to={`/bikeCRUD/${bike.id}`}>{bike.id}</Link></td>
                                <td>{bike.attributes.battery_lvl}%</td>
                                <td onClick={() => onBikePointClick(bike.attributes.last_position)} style={{ cursor: 'pointer' }}>
                                    {bike.attributes.last_position}</td>
                                <td>{bike.attributes.is_available ? 'Available' : 'Not Available'}</td>
                                <td>{new Date(bike.attributes.created_at).toLocaleString()}</td>
                                <td>{new Date(bike.attributes.updated_at).toLocaleString()}</td>
                                <td>{bike.relationships.city.data.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Add PropTypes for validation
ListBikeCity.propTypes = {
    onBikePointClick: PropTypes.func.isRequired, // Define the type of the prop
};

export default ListBikeCity;
