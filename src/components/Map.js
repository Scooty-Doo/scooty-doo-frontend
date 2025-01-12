import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Importera Leaflet för att skapa en anpassad ikon
import Wkt from 'wicket'; // Importera Wicket
import 'wicket/wicket-leaflet';
import styles from '../styles/MapView.module.css';
import PropTypes from 'prop-types';
import { Socket } from 'socket.io-client';
// import BikeMarker from './marker';

// Formatera om backends position till leaflet (lng och lat)
const parsePoint = (point) => {
    if (!point) return null;
    const match = point.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (!match) return null; // Returnera null om formatet är fel
    const [, lng, lat] = match; // Extrahera längd och latitud
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
};

const MapView = ({ userType, socket }) => {
    const [bikes, setBikes] = useState([]); // State för att hålla cyklarna
    const [zones, setZones] = useState([]); // State för att hålla zondata
    const [loading, setLoading] = useState(true); // State för att hantera laddning
    const [userPosition, setUserPosition] = useState(null);

    const bikeIcon = new L.divIcon({
        className: styles["bike-icon"],
        iconSize: [30, 36],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
    
    const userIcon = new L.Icon({
        iconUrl:'https://img.icons8.com/?size=100&id=13800&format=png&color=000000',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    // Hämtar cyklar från API och lägger till zoner
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserPosition([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error('Error fetching user position:', error);
                }
            );
        }

        const fetchBikes = async () => {
            // Sets the route depending on the usertype
            let url = userType === "admin"
                ? "http://127.0.0.1:8000/v1/bikes/"
                : "http://127.0.0.1:8000/v1/bikes/available"
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data.data)
                setBikes(data.data);
            } catch (error) {
                console.error('Error fetching bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        // Testdata för zoner, hämta från api sen
        const mockZones = [
            {
                id: 1,
                name: 'Malmö C',
                wkt: 'POLYGON((12.999047 55.60899, 12.999326 55.608445, 12.999219 55.608439, 12.99895 55.608984, 12.999047 55.60899))',
                type: 'Parking',
            },
            {
                id: 2,
                name: 'Slow Zone - Gamla Stan',
                wkt: 'POLYGON((13.0105 55.5985, 13.0112 55.5987, 13.0120 55.5980, 13.0115 55.5975, 13.0108 55.5978, 13.0105 55.5985))',
                type: 'Slow',
            },
            
            {
                id: 3,
                name: 'Gamla Stan',
                wkt: 'POLYGON((13.000722 55.605184, 13.002591 55.604784, 13.004537 55.605037, 13.004352 55.606366, 13.002155 55.606819, 13.000722 55.605184))',
                type: 'Forbidden',
            },
            {
                id: 4,
                name: 'Charging Zone - Malmö C',
                wkt: 'POLYGON((12.9995 55.6092, 13.0001 55.6091, 13.0002 55.6095, 12.9996 55.6096, 12.9995 55.6092))',
                type: 'Charging',
            },
            
        ];
        setZones(mockZones);
        fetchBikes();
    }, [userType]);

    // useEffect to get updates from socket
    useEffect(() => {
        if (userType != "admin" || !socket) {
            return
        }

        const update_bike = (data) => {
            let bike = bikes.find((bike) =>  bike.id == data.bike_id);
            // Could be done with a for loop
            // Updates the bikes-list, but doesn't update the marker.
            bike.attributes.battery_lvl = data.battery_lvl;
            bike.attributes.city_id = data.city_id;
            bike.attributes.last_position = data.last_position;
            bike.attributes.is_available = data.is_available;
            bike.attributes.meta_data = data.meta_data;
            update_bike_on_map(bike);            
        };

        const update_bike_on_map = (updatedBike) => { // bikes update on map now, not entierly sure how this works
            setBikes((prevBikes) =>
                prevBikes.map((bike) =>
                    bike.id === updatedBike.id ? updatedBike : bike // If bike.id is match to updatedBike.id then replace old bike with new bike info
                )
            );
        };
        socket.on("bike_update", update_bike);
        return () => {
            socket.off("bike_update", update_bike)
        }
    }, [socket, bikes, userType]);

    const check_position = (bike) => {
        const position = parsePoint(bike.attributes.last_position);
        // Kontrollera att positionen är giltig
        if (!position) {
            console.warn(`Ogiltig position för cykel ${bike.id}:`, bike.attributes.last_position);
            return false;
        }
        return position;
    };

    if (loading) {
        return <p>Loading</p>
    }
    return (
        <MapContainer
            center={userPosition ?? [55.604981, 13.003822]}
            zoom={15}
            className={styles.mapContainer}
        >
            <TileLayer
                url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b50533aeae574d949113dae3897804bc"
                attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
            />

            {userPosition && (
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>Här är du!</Popup>
                </Marker>
            )}
            {bikes.map((bike) => {
                let position = check_position(bike);
                if (!position) {
                    return null;
                }
                return (
                    <Marker
                        key={bike.id}
                        position={position}
                        icon={bikeIcon}
                    >
                        <Popup>
                                Cykel {bike.id}: {bike.attributes.battery_lvl}% batteri.
                        </Popup>
                    </Marker>
                )
            })}

            {/* Lägg till polygoner från zondata */}
            {zones.map((zone) => {
                const wkt = new Wkt.Wkt();
                try {
                    wkt.read(zone.wkt); // Konvertera WKT till Leaflet-geometri
                    const leafletPolygon = wkt.toObject(L); // Skapa Leaflet-geometri
                    return (
                        <Polygon
                            key={zone.id}
                            positions={leafletPolygon.getLatLngs()}
                            color={
                                zone.type === 'Parking' ? 'blue' :
                                    zone.type === 'Slow' ? 'orange' :
                                        zone.type === 'Forbidden' ? 'red' :
                                            zone.type === 'Charging' ? 'green' : 'gray'
                            }
                            fillOpacity={0.4}
                        >
                            <Popup>{zone.type}</Popup>
                        </Polygon>
                    );
                } catch (error) {
                    console.error(`Invalid WKT for zone ${zone.id}:`, error);
                    return null;
                }
            })}
        </MapContainer>
    );
};

MapView.propTypes = {
    userType: PropTypes.string,
    socket: Socket
};

export default MapView;
