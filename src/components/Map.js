import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Importera Leaflet för att skapa en anpassad ikon
import Wkt from 'wicket'; // Importera Wicket
import 'wicket/wicket-leaflet';
import styles from '../styles/MapView.module.css';
import PropTypes from 'prop-types';
import { fetchZones } from "../api/zonesApi";
import { fetchAvailableBikes } from '../api/bikeApi';
import 'leaflet.markercluster';

const MapView = ({ onBikeClick, onCitySelect }) => {
    const [bikes, setBikes] = useState([]); // State för att hålla cyklarna
    const [zones, setZones] = useState([]); // State för att hålla zondata
    const [loading, setLoading] = useState(true); // State för att hantera laddning
    const [cityId, setCityId] = useState(null);
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
        if (!cityId) return;
    
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
            try {
                const data = await fetchAvailableBikes(cityId);
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
    }, [cityId]);

    const handleCitySelection = (e) => {
        const selectedCity = parseInt(e.target.value);
        setCityId(selectedCity);
        if (onCitySelect) {
            console.log("Skickar cityId till HomeClient:", selectedCity);
            onCitySelect(selectedCity);
        } else {
            console.warn("onCitySelect är inte definierad.");
        }
    };
    
    

    useEffect(() => {
        console.log("Vald cityId:", cityId);
    }, [cityId]);
    

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
                                <span style="color: white; font-weight: bold; font-size: 18px; background-color: #78b7ff; padding: 6px; border-radius: 10px;" >${childCount}</span>
                                <svg height="60" width="60" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-60.48 -60.48 624.96 624.96" xml:space="preserve" fill="#0081d1" stroke="#0081d1" stroke-width="14.112">
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
                    marker.on('click', () => {
                        onBikeClick(bike.id); // Id vid klick
                    });
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
    

    if (!cityId) {
        return (
            <div className={styles.citySelector}>
                <h2 className={styles.cityTitle}>Välj stad</h2>
                <select 
                    onChange={handleCitySelection} 
                    defaultValue="" 
                    className={styles.cityDropdown}
                >
                    <option value="" disabled>Välj en stad...</option>
                    <option value="1">Göteborg</option>
                    <option value="2">Stockholm</option>
                    <option value="3">Malmö</option>
                </select>
            </div>
        );
    }

    if (loading) {
        return <p>Loading...</p>;
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

MapView.propTypes = {
    userType: PropTypes.string,
    token: PropTypes.string,
    onBikeClick: PropTypes.func.isRequired,
    onCitySelect: PropTypes.func.isRequired,
};

export default MapView;
