import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapWithZones from '../../components/MapDrawZones';

const ZoneAdmin = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div>

            <div><MapWithZones /></div>
        </div>
    );


};

export default ZoneAdmin;
