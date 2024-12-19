import React from 'react';
import ListBike from '../../components/ListBike'; // Import the ListBike component
import ListBikeCity from '../../components/ListBikeCity'; // Import the ListBikeCity component som har sök funktionalitet

const HomeAdmin = () => {
    return (
      <div>
        <h1>Bike Inventory</h1>
        {/* <ListBike /> */}
        <ListBikeCity />
      </div>
    );
  };

export default HomeAdmin;
