import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import styles from '../../styles/BikeCRUDAdmin.module.css';

    // What does this file need to be able to do?
    // Get the bike id from the preavious page for use in displaying the form and also store said id to be able to update the bike using the form
        // this is to be done later, for now just set a variable bikeId to a static number (2)
    // Have a form that displays the information of the bike
    // Be able to use that form to update the bike. (Once the form has been submitted, transform the information in the form into a json formatt that the update bike input is looking for)
    // Given that the JSON data of the bike contains a link to self that just contains the fetch link to call via id we COULD just take that from the previous page and put it into a variable called (fetchBikeUrl)

const BikeCRUDAdmin = () => {
    const { id } = useParams(); // Get bike ID from URL params
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const bikeId = 2;

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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/v1/bikes/${bikeId}`, {
                method: 'PUT', // Update bike details
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bike),
            });

            if (!response.ok) throw new Error('Failed to update bike');
            navigate('/admin'); // Navigate back to admin page after update
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBike((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.formContainer}>
            <h1>Edit Bike: {bike.name || 'Unknown'}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={bike.name || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Type:
                    <input
                        type="text"
                        name="type"
                        value={bike.type || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={bike.location || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Update Bike</button>
            </form>
        </div>
    );
};

export default BikeCRUDAdmin;
