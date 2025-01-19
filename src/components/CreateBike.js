import React, { useState } from 'react';
import styles from '../styles/BikeCRUDAdmin.module.css';


// The component works as intended, however i have not polished the code.
// remove old code from bikeCRUDAdmin.js
// make component be able to submitt bike data to create a new bike
// make component find the lowest currently available bike ID to assign to the new bike
// profit?

const CreateBike = () => {
    // const [error, setError] = useState(null);
    const [bike, setBike] = useState({
        data: {
            attributes: {
                battery_lvl: '',
                last_position: '',
                is_available: false,
            },
            relationships: {
                city: {
                    data: {
                        id: '',
                    },
                },
            },
        },
    });



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

        console.log("formatted yikes",JSON.stringify(formattedBike));

        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/v1/bikes/`, {
                method: 'POST', // request type
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedBike), // Send bike object as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to create the new bike');
            }

            const result = await response.json();
            console.log('Bike data submitted successfully:', result);
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
            } else if (name === 'battery_lvl') {
                updatedBike.data.attributes.battery_lvl = newValue;
            } else if (name === 'last_position') {
                updatedBike.data.attributes.last_position = newValue;
            }
    
            // Return the updated bike data
            return updatedBike;
        });
    };


    // if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.createForm}>
            <form onSubmit={handleSubmit}>
                {/* Battery Level (non-editable) */}
                <div>
                    <label htmlFor="battery_lvl">Battery Level:</label>
                    <input
                        type="number"
                        id="battery_lvl"
                        name="battery_lvl"
                        value={bike?.data?.attributes?.battery_lvl || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Last Position (non-editable) */}
                <div>
                    <label htmlFor="last_position">Last Position:</label>
                    <input
                        type="text"
                        id="last_position"
                        name="last_position"
                        value={bike?.data?.attributes?.last_position || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Is Available (editable) */}
                <div>
                    <label htmlFor="is_available">Is Available:</label>
                    <input
                        type="checkbox"
                        id="is_available"
                        name="is_available"
                        checked={bike?.data?.attributes?.is_available || false}
                        onChange={handleChange}
                    />
                </div>

                {/* City ID (editable) */}
                <div>
                    <label htmlFor="cityId">City ID:</label>
                    <input
                        type="text"
                        id="cityId"
                        name="cityId"
                        value={bike?.data?.relationships?.city?.data?.id || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Works */}
                <div>
                    <button type="submit">Add new bike</button>
                </div>
            </form>
        </div>
    );
};

export default CreateBike;
