import React, { useEffect, useState } from 'react';
import styles from '../styles/HomeAdmin.module.css';

const ListBike = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    // Fetch the data from the API (adjust URL accordingly)
    fetch('http://localhost:8000/v1/bikes') // Replace with your API URL
        .then((response) => response.json())
        .then((data) => {
        setBikes(data.data); // Store the 'data' array from the response
        setLoading(false);
        })
        .catch((error) => {
        setError(error);
        setLoading(false);
        });
    }, []); // Empty dependency array means it will run once on mount

    if (loading) {
        return <p>Loading bikes...</p>;
    }

    if (error) {
        return <p>Error loading bikes: {error.message}</p>;
    }

    return (
        <div>
          <h2>Bike List</h2>
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
                    <td>{bike.id}</td>
                    <td>{bike.attributes.battery_lvl}%</td>
                    <td>{bike.attributes.last_position}</td>
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

export default ListBike;



