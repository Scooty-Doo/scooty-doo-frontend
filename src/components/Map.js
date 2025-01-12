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

    const bikeIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 294.006 294.006" xml:space="preserve" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path style="fill:#211915;" d="M259.999,211.872c-1.629,0-3.229,0.122-4.797,0.345L173.963,39.691l15.024-6.358 c5.086-2.152,7.465-8.02,5.313-13.106s-8.021-7.466-13.106-5.312l-50.882,21.532c-5.086,2.152-7.465,8.021-5.313,13.106 c1.614,3.814,5.317,6.105,9.214,6.105c1.299,0,2.621-0.255,3.893-0.794l17.425-7.374l71.754,152.384 c-14.251,7.906-24.207,21.882-27.196,37.708H91.61c-2.729-19.37-13.387-34.848-29.179-41.572 c-5.083-2.164-10.955,0.202-13.118,5.284c-2.164,5.081,0.202,10.954,5.283,13.118c9.669,4.117,14.721,13.531,16.697,23.17h-4.307 c-3.713-14.754-17.089-25.711-32.979-25.711C15.255,211.872,0,227.128,0,245.879s15.255,34.007,34.007,34.007 c14.641,0,27.149-9.3,31.931-22.303h143.213c5.523,0,10-4.478,10-10c0-12.093,6.459-23.331,16.691-29.534l1.271,2.699 c-6.828,6.224-11.12,15.185-11.12,25.13c0,18.751,15.255,34.007,34.007,34.007s34.007-15.256,34.007-34.007 S278.75,211.872,259.999,211.872z M34.007,259.885c-7.724,0-14.007-6.283-14.007-14.007s6.283-14.007,14.007-14.007 c4.617,0,8.707,2.255,11.26,5.711h-11.26c-5.523,0-10,4.478-10,10s4.477,10,10,10h7.674 C39.474,259.034,36.84,259.885,34.007,259.885z M259.999,259.885c-7.724,0-14.007-6.283-14.007-14.007 c0-1.611,0.287-3.153,0.79-4.595l4.169,8.855c1.705,3.62,5.301,5.742,9.054,5.742c1.427,0,2.876-0.307,4.253-0.955 c4.997-2.353,7.14-8.311,4.787-13.307l-4.169-8.853c5.322,1.987,9.128,7.107,9.128,13.113 C274.006,253.602,267.723,259.885,259.999,259.885z"></path>
                    </g>
                </g>
            </svg>
        `),
        iconSize: [32, 32], // Storlek på ikonen
        iconAnchor: [16, 32], // Placering av ikonen
        popupAnchor: [0, -32], // Placering av popup
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
