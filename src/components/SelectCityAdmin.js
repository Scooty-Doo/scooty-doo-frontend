import React, { useState, useEffect } from 'react';
import { fetchCities } from '../api/citiesApi';
import PropTypes from "prop-types";

const CitySelector = ({ onCitySelect }) => {
    // State to store the list of cities
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('');

    // Fetch cities from the API when the component is mounted
    useEffect (() => {
        const getCities = async () => {
            const data = await fetchCities();
            console.log("getCities: ",data.data);
            setCities(data.data);
            setLoading(false);
        };
        getCities();
    }, []); // Empty dependency array means this effect runs only once after the component mounts

    // Handle change in selected city
    const handleCityChange = (event) => {
        const cityId = event.target.value;
        setSelectedCity(cityId);

        // Pass the selected city data to the parent component
        const selectedCityData = cities.find((city) => city.id === cityId);
        onCitySelect(selectedCityData);
    };

    if (loading) {
        return <div>Loading cities...</div>; // Show loading message while fetching data
    }

    return (
        <div>
            <label htmlFor="cityDropdown">Select a City:</label>
            <select 
                id="cityDropdown" 
                value={selectedCity} 
                onChange={handleCityChange}
            >
                <option value="">Choose a city</option>
                {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.attributes.city_name}
                    </option>
                ))}
            </select>
            {selectedCity && <p>You selected city ID: {selectedCity}</p>}
        </div>
    );
};

CitySelector.propTypes = {
    onCitySelect: PropTypes.func.isRequired,
};

export default CitySelector;
