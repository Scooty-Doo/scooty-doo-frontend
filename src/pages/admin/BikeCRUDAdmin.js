import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import styles from '../../styles/BikeCRUDAdmin.module.css';

    // What does this file need to be able to do?
    // Get the bike id from the preavious page for use in displaying the form and also store said id to be able to update the bike using the form
        // this is to be done later, for now just set a variable bikeId to a static number
    // Have a form that displays the information of the bike (done)
    // Be able to use that form to update the bike. (Once the form has been submitted, transform the information in the form into a json formatt that the update bike input is looking for) (done)
    // Given that the JSON data of the bike contains a link to self that just contains the fetch link to call via id we COULD just take that from the previous page and put it into a variable called (fetchBikeUrl)

    // Which should be editable?
    // bikeId == no
    // batterylvl == no
    // location == no
    // available == yes
    // created date == no
    // updated date == no?
    // cityId == yes
    // links == no
    // links2 == no

const BikeCRUDAdmin = () => {
    const { id } = useParams(); // Get bike ID from URL params
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const bikeId = 3;

    // Fetch bike details
    useEffect(() => {
        const fetchBike = async () => { // hämtar information om biken som admin försöker ändra
            try {
                const response = await fetch(`http://localhost:8000/v1/bikes/${bikeId}`); // Replace with your API endpoint
                if (!response.ok) throw new Error('Failed to fetch bike details');
                const data = await response.json();
                console.log(data); // temporary log for debugging
                setBike(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBike();
    }, [bikeId]);

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
            const response = await fetch(`http://localhost:8000/v1/bikes/${bikeId}`, {
                method: 'PATCH', // or 'PUT' depending on whether you're creating or updating
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedBike), // Send bike object as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to submit the bike data');
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
            }
    
            // Return the updated bike data
            return updatedBike;
        });
    };

    const deleteBike = async (event) => {
        event.preventDefault(); // Prevent page refresh
    
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this bike?");
    
        if (!confirmDelete) {
            console.log("Delete action canceled by user.");
            return; // Exit the function if the user cancels
        }
    
        console.log(`Attempting to delete bike with ID: ${bikeId}`);

        try {
            const response = await fetch(`http://localhost:8000/v1/bikes/${bikeId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                console.log('Bike deleted successfully');
            } else {
                throw new Error('Failed to delete the bike');
            }
        } catch (error) {
            console.error('Error deleting bike:', error);
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit}>
            {/* Bike ID (non-editable) */}
            <div>
                <label htmlFor="id">Bike ID:</label>
                <input
                    type="text"
                    id="id"
                    name="id"
                    value={bike?.data?.id || ""}
                    readOnly
                />
            </div>

            {/* Battery Level (non-editable) */}
            <div>
                <label htmlFor="battery_lvl">Battery Level:</label>
                <input
                    type="number"
                    id="battery_lvl"
                    name="battery_lvl"
                    value={bike?.data?.attributes?.battery_lvl || ""}
                    readOnly
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
                    readOnly
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

            {/* Created At (non-editable) */}
            <div>
                <label htmlFor="created_at">Created At:</label>
                <input
                    type="text"
                    id="created_at"
                    name="created_at"
                    value={bike?.data?.attributes?.created_at || ""}
                    readOnly
                />
            </div>

            {/* Updated At (non-editable) */}
            <div>
                <label htmlFor="updated_at">Updated At:</label>
                <input
                    type="text"
                    id="updated_at"
                    name="updated_at"
                    value={bike?.data?.attributes?.updated_at || ""}
                    readOnly
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

            {/* Bike Link (non-editable) */}
            <div>
                <label htmlFor="bikeById">Bike Link:</label>
                <input
                    type="text"
                    id="bikeLink"
                    name="bikeLink"
                    value={bike?.data?.links?.self || ""}
                    readOnly
                />
            </div>

            {/* Top-Level Link (non-editable) */}
            <div>
                <label htmlFor="bikesAll">All bikes link:</label>
                <input
                    type="text"
                    id="topLevelLink"
                    name="topLevelLink"
                    value={bike?.links?.self || ""}
                    readOnly
                />
            </div>

            {/* Submit Button (No functionality yet) */}
            <div>
                <button type="submit">Submit</button>
            </div>
            <div>
                <button type="submit" onClick={deleteBike}>
                    Delete
                </button>
            </div>
        </form>
    );
};

export default BikeCRUDAdmin;
