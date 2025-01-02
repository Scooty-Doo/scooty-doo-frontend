// TripsList.js
import React from 'react';
import styles from '../styles/ListBikeCity.module.css';

const TripsList = ({ trips }) => { // behöver lägga till listan i denna listvy
    console.log("trips:",trips);
    // Check if trips and trips.data are defined and contain data
    if (!trips || !trips.data || trips.data.length === 0) {
        return <div>No trips available.</div>;
    }

  return (
    <div>
        <h2>Trips List</h2>
        <div className={styles.tableContainer}>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>start_position</th>
                    <th>end_position</th>
                    <th>start_time</th>
                    <th>end_time</th>
                    <th>time_fee</th>
                    <th>total_fee</th>
                    <th>link</th>
                </tr>
            </thead>
            <tbody>
                {trips.data.map((trip) => (
                <tr key={trip.id}>
                    <td>{trip.id}</td>
                    <td>{trip.attributes.start_position}</td>
                    <td>{trip.attributes.end_position}</td>
                    <td>{trip.attributes.start_time}</td>
                    <td>{trip.attributes.end_time}</td>
                    <td>{trip.attributes.time_fee}</td>
                    <td>{trip.attributes.total_fee}</td>
                    <td>{trip.links.self}</td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default TripsList;
