import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/BikeCRUDAdmin.module.css';
import { fetchBike, bikeDetails, bikeDelete } from "../../api/bikeApi";
import CreateBike from '../../components/CreateBike';

const BikeCRUDAdmin = () => {
    const { bikeId } = useParams(); // Get bike ID from URL params
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);
    // const bikeId = 3;
    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    // Fetch bike details
    useEffect(() => {
        if (bikeId) {
            fetchBike(bikeId).then((data) => {
                setBike(data);
            });
        }
        // fetchBike();
    }, [bikeId]);

    useEffect(() => {
        if (!bike) {
            setLoading(false);
        }
    }, [bike])

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page refresh on submit
        console.log("big yikes",JSON.stringify(bike)); // debugging

        const formattedBike = {
            battery_lvl: bike.data.attributes.battery_lvl,
            city_id: bike.data.relationships.city.data.id,
            last_position: bike.data.attributes.last_position,
            is_available: bike.data.attributes.is_available,
            meta_data: {},
        };

        // Load the variables with bike info for readability
        const battery_lvl = bike.data.attributes.battery_lvl;
        const city_id = bike.data.relationships.city.data.id;
        const last_position = bike.data.attributes.last_position;
        const is_available = bike.data.attributes.is_available;

        console.log("formatted yikes",JSON.stringify(formattedBike));

        try {
            await bikeDetails(bikeId, battery_lvl, city_id, last_position, is_available);
            console.log("Bike Info Saved");
        } catch (error) {
            console.error('Error submitting bike data:', error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
    
        // Update the bike state
        setBike((prevBike) => {
            // Create a shallow copy of the bike data
            const updatedBike = { ...prevBike };
    
            // Find and update the corresponding value in the attributes or relationships
            if (name === 'is_available') {
                updatedBike.data.attributes.is_available = newValue;
            } else if (name === 'cityId') {
                updatedBike.data.relationships.city.data.id = newValue;
            }
    
            // Return the updated bike data
            return updatedBike;
        });
    };

    const deleteBike = async (event) => {
        event.preventDefault(); // Prevent page refresh
        await bikeDelete(bikeId);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.mainForm}>
                <form onSubmit={handleSubmit}>
                    <h2 className={styles.heading}>Ändra Cykel-data</h2>
                    {/* Bike ID (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="id">Bike ID:</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={bike?.data?.id || ""}
                            readOnly />
                    </div>

                    {/* Battery Level (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="battery_lvl">Battery Level:</label>
                        <input
                            type="number"
                            id="battery_lvl"
                            name="battery_lvl"
                            value={bike?.data?.attributes?.battery_lvl || ""}
                            readOnly />
                    </div>

                    {/* Last Position (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="last_position">Last Position:</label>
                        <input
                            type="text"
                            id="last_position"
                            name="last_position"
                            value={bike?.data?.attributes?.last_position || ""}
                            readOnly />
                    </div>

                    {/* Is Available (editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="is_available">Is Available:</label>
                        <input
                            type="checkbox"
                            id="is_available"
                            name="is_available"
                            checked={bike?.data?.attributes?.is_available || false}
                            onChange={handleChange} />
                    </div>

                    {/* Created At (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="created_at">Created At:</label>
                        <input
                            type="text"
                            id="created_at"
                            name="created_at"
                            value={bike?.data?.attributes?.created_at || ""}
                            readOnly />
                    </div>

                    {/* Updated At (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="updated_at">Updated At:</label>
                        <input
                            type="text"
                            id="updated_at"
                            name="updated_at"
                            value={bike?.data?.attributes?.updated_at || ""}
                            readOnly />
                    </div>

                    {/* City ID (editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="cityId">City ID:</label>
                        <input
                            type="text"
                            id="cityId"
                            name="cityId"
                            value={bike?.data?.relationships?.city?.data?.id || ""}
                            onChange={handleChange} />
                    </div>

                    {/* Bike Link (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="bikeById">Bike Link:</label>
                        <input
                            type="text"
                            id="bikeLink"
                            name="bikeLink"
                            value={bike?.data?.links?.self || ""}
                            readOnly />
                    </div>

                    {/* Top-Level Link (non-editable) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="bikesAll">All bikes link:</label>
                        <input
                            type="text"
                            id="topLevelLink"
                            name="topLevelLink"
                            value={bike?.links?.self || ""}
                            readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <button type="submit">Submit</button>
                    </div>
                    <div className={styles.formGroup}>
                        <button type="submit" onClick={deleteBike}>
                        Delete
                        </button>
                    </div>
                </form>
            </div>
            <div className={styles.createForm}>
                <h2 className={styles.heading}>Skapa Cykel</h2>
                <CreateBike />
            </div>
        </div>
        
    );
};

export default BikeCRUDAdmin;
