import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Importera Leaflet för att skapa en anpassad ikon
import Wkt from 'wicket'; // Importera Wicket
import 'wicket/wicket-leaflet';
import styles from '../styles/MapAdmin.module.css';
import PropTypes from 'prop-types';
import { Socket } from 'socket.io-client';
import { fetchZones } from "../api/zonesApi";
//import { fetchBikes } from '../api/bikeApi';
import { fetchAvailableBikes, fetchBikesInZone } from '../api/bikeApi';
import 'leaflet.markercluster';
// import BikeMarker from './marker';
import { fetchCities } from '../api/citiesApi';

const UpdateMapCenter = ({ center }) => {
    const pointToLatLngs = (lastPosition) => {
        // Extract the coordinates from the POINT format
        if (lastPosition === null) {
            return null
        }
        const coordinates = lastPosition.match(/POINT\(([^)]+)\)/)[1].split(' ');
        return coordinates; // formatted lat lngs in an array
    };
    const coords = pointToLatLngs(center);
    console.log("Coords in UpdateMapCenter",coords);
    const map = useMap();

    useEffect(() => {
        if (coords && map) {
            map.flyTo([coords[1],coords[0]], map.getZoom(), {
                animate: true,
                duration: 1.5,
            });
        }
    }, [center, map, coords]);

    return null;
};

const MapAdmin = ({ userType, socket, selectedBikePoint }) => {
    const [bikes, setBikes] = useState([]); // State för att hålla cyklarna
    const [zones, setZones] = useState([]); // State för att hålla zondata
    const [loading, setLoading] = useState(true); // State för att hantera laddning
    const [userPosition, setUserPosition] = useState(null);
    let bikeCounts = {};
    // const cityId = 3;
    // hämta cityId från den valda staden man kollar på och använd den som ett filter för vilka bikes man hämtar
    console.log("selectedBikePoint: ",selectedBikePoint);

    // Function för att uppdatera bikeCount för att räkna hur många bikes i olika zoner
    const updateBikeCount = (zoneId, change) => {
        if (!bikeCounts[zoneId]) {
            bikeCounts[zoneId] = 0; // Initialize count if it doesn't exist
        }
        bikeCounts[zoneId] += change; // Increase or decrease based on the 'change' argument
    };

    useEffect (() => { // hämta city data
        const getCities = async () => {
            const data = await fetchCities();
            console.log("getCities: ",data.data);
        };
        getCities();
    }, []);

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



        const fetchBikesFromApi = async () => {
            // Sets the route depending on the usertype
            // if admin - Tim fixaaaaaaaaa

            try {
                const data = await fetchAvailableBikes();
                console.log(data.data)
                setBikes(data.data);
            } catch (error) {
                console.error('Error fetching bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMapZones = async () => {
            try {
                const zoneData = await fetchZones();
                setZones(zoneData.data.map(zone => ({
                    id: zone.id,
                    name: zone.attributes.zone_name,
                    wkt: zone.attributes.boundary,
                    type: zone.attributes.zone_type_id === 1 ? 'Parking' :
                        zone.attributes.zone_type_id === 2 ? 'Slow' :
                            zone.attributes.zone_type_id === 3 ? 'Forbidden' :
                                zone.attributes.zone_type_id === 4 ? 'Charging' : 'Unknown'
                })));
            } catch (error) {
                console.error('Error fetching zones:', error);
            }
        };

        fetchMapZones();
        fetchBikesFromApi();
    }, [userType]);

    useEffect(() => {
        const fetchBikesFromZones = async () => { // möjliga ändringar till function, lägg till att man ger cityId för staden man kollar på och får functionen att köra när cityId byts
            const cityId = 3; // lägg till att cityId sätts till den stad man har vald och att functionen körs om när man ändrar stad
            const zoneTypeIds = [1, 2]; // List of zoneTypeIds to fetch
            const allBikes = []; // To store combined bike data from both zones
            const allBikesSorted = [];
        
            try {
                for (const zoneTypeId of zoneTypeIds) {
                    const data = await fetchBikesInZone(zoneTypeId, cityId); // Call your fetch function
                    console.log(`Data for zoneTypeId ${zoneTypeId}:`, data.data);
                    allBikesSorted.push(data.data); // lägg in bikesen från varje fetch i varsin array i allBikes arrayen
                    allBikes.push(...data.data);
                }
                console.log("allBikes: ",allBikes)
                console.log("allBikesSorted: ",allBikesSorted)
            } catch (error) {
                console.error("Error fetching bikes:", error);
            } finally {
                setLoading(false);
            }
            allBikes.forEach(bike => {
                const zoneId = bike.relationships.zone.data.id;
                const change = 1;
                updateBikeCount(zoneId, change); // change kommer vara + eller - 1 för start/end trip och vad som + för första hämtning
            });
            console.log("bikeCounts initialized: ",bikeCounts)
        };
        fetchBikesFromZones();
    });

    const ClusterMarkers = () => {
        const map = useMap();
    
        useEffect(() => {
            const cluster = L.markerClusterGroup({
                maxClusterRadius: 50,
                iconCreateFunction: (cluster) => {
                    const childCount = cluster.getChildCount();
    
                    return new L.DivIcon({
                        html: `
                            <div class="div-icon-cluster">
                                <span>${childCount}</span>
                                <svg height="40" width="40" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-60.48 -60.48 624.96 624.96" xml:space="preserve" fill="#0081d1" stroke="#0081d1" stroke-width="14.112">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> <circle style="fill:#ffffff;" cx="252" cy="252" r="252"></circle> 
                                <g> <path style="fill:#324A5E;" d="M374.1,290.1c-21.5,0-39,17.5-39,39s17.5,39,39,39s39-17.5,39-39 C413.2,307.6,395.7,290.1,374.1,290.1z"></path> <path style="fill:#324A5E;" d="M141,290.1c-21.5,0-39,17.5-39,39s17.5,39,39,39s39-17.5,39-39S162.5,290.1,141,290.1z"></path> </g> <path style="fill:#80b7ff;" d="M318.3,109.8h28.5c6.3,0,11.4-5.1,11.4-11.4S353.1,87,346.8,87h-89.3c-6.3,0-11.4,5.1-11.4,11.4 s5.1,11.4,11.4,11.4h37.1L334,258.7l-31,30.9h-96.3c-9.5-26-36.9-45.3-66.4-45.3c-37.3,0-70,30.1-70,64.5c0,6.3,5.1,11.4,11.4,11.4 s11.4-5.1,11.4-11.4c0-19.7,20.2-41.7,47.2-41.7c24.6,0,43.4,18.7,46.6,36c1,5.5,6,9.3,11.4,9.3c0.2,0,0.5,0.1,0.7,0.1h108.7 c3,0,5.9-1.2,8.1-3.3l39-39c3-2.9,4.1-7.3,2.9-11.3L318.3,109.8z"></path> 
                                <g> <circle style="fill:#aea8ff;" cx="374.1" cy="329.2" r="18.7"></circle> <circle style="fill:#aea8ff;" cx="141" cy="329.2" r="18.7"></circle> </g> </g></svg>
                            </div>`,
                        className: 'marker-cluster',
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                    });
                },
            });
    
            bikes.forEach(bike => {
                const position = bike.attributes.last_position.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
                if (position) {
                    const [, lng, lat] = position;
                    const marker = L.marker([parseFloat(lat), parseFloat(lng)], { icon: bikeIcon });
                    marker.bindPopup(`Cykel ${bike.id}: ${bike.attributes.battery_lvl}% batteri.`);
                    cluster.addLayer(marker);
                }
            });
    
            map.addLayer(cluster);
    
            return () => {
                map.removeLayer(cluster);
            };
        }, [map]);
    
        return null;
    };
    
    // useEffect to get updates from socket
    useEffect(() => {
        if (userType != "admin" || !socket) {
            return
        }

        const update_bike = (data) => {
            console.log("update_bike Data:",data);
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

        const update_bike_on_map = (updatedBike) => {
            setBikes((prevBikes) =>
                prevBikes.map((bike) =>
                    bike.id === updatedBike.id ? updatedBike : bike // If bike.id is match to updatedBike.id then replace old bike with new bike info
                )
            );
        };

        const handle_bike_update_start = (data) => {
            if (!data.zone_id) {
                console.log("zon id i start var null",data.zone_id);
                return;
            }
            const count = -1;
            const zone_id = data.zone_id;
            console.log("Bike update started:", data);
            updateBikeCount(zone_id, count);
            console.log("bikeCounts efter start trip: ",bikeCounts)
        };

        const handle_bike_update_end = (data) => {
            if (!data.zone_id) {
                console.log("zon id i start var null",data.zone_id);
                return;
            }
            const count = 1;
            const zone_id = data.zone_id;
            console.log("Bike update ended:", data);
            updateBikeCount(zone_id, count);
            console.log("bikeCounts efter end trip: ",bikeCounts)
        };

        socket.on("bike_update", update_bike);
        socket.on("bike_update_start", handle_bike_update_start);
        socket.on("bike_update_end", handle_bike_update_end);
        return () => {
            socket.off("bike_update", update_bike);
            socket.off("bike_update_start", handle_bike_update_start);
            socket.off("bike_update_end", handle_bike_update_end);
        }
    }, [socket, bikes, userType]);

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
            <ClusterMarkers />
            <UpdateMapCenter center={selectedBikePoint} />

            {userPosition && (
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>Här är du!</Popup>
                </Marker>
            )}

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

MapAdmin.propTypes = {
    userType: PropTypes.string,
    socket: Socket,
    token: PropTypes.string,
    selectedBikePoint: PropTypes.arrayOf(PropTypes.number)
};

UpdateMapCenter.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MapAdmin;
