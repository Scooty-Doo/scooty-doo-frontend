import React, { useEffect, useState } from 'react';
import styles from '../styles/HomeAdmin.module.css';

const ListBikeCity = () => {
  const [bikes, setBikes] = useState([]);
  const [cityId, setCityId] = useState('');
  const [bikeId, setBikeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBikesByCity = () => {
    if (!cityId) return;
    setLoading(true);
    setError(null);

    // gör api request setup
    const apiUrl = `http://localhost:8000/v1/bikes?city_id=${cityId}`;

    fetch(apiUrl) // hämtar alla bikes från backend
      .then((response) => response.json())
      .then((data) => {
        setBikes(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const fetchBikeById = () => {
    if (!bikeId) return; // om ingent bikeId är givet
    setLoading(true);
    setError(null);

    // gör api request setup
    const apiUrl = `http://localhost:8000/v1/bikes/${bikeId}`;

    fetch(apiUrl) // hämtar bike med givet id
      .then((response) => response.json())
      .then((data) => {
        setBikes([data.data]); // Sätt biken i en array
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Bikes List</h2>
      <div>
        <input
          type="number"
          placeholder="Enter City ID"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
        />
        <button onClick={fetchBikesByCity}>Search by City ID</button>
      </div>

      <div>
        <input
          type="number"
          placeholder="Enter Bike ID"
          value={bikeId}
          onChange={(e) => setBikeId(e.target.value)}
        />
        <button onClick={fetchBikeById}>Search by Bike ID</button>
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

export default ListBikeCity;
