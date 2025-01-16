import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Wkt from 'wicket';
import PropTypes from 'prop-types';
import 'wicket/wicket-leaflet';
import styles from '../styles/MapView.module.css';
import { fetchZones } from "../api/zonesApi";
import { fetchAvailableBikes } from '../api/bikeApi';
import 'leaflet.markercluster';

const MapView = ({ userType, socket, onBikeClick }) => {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPosition, setUserPosition] = useState(null);

    const bikeIcon = new L.divIcon({
        className: styles["bike-icon"],
        iconSize: [30, 36],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
    
    const userIcon = new L.Icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=13800&format=png&color=000000',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

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
            try {
                const data = await fetchAvailableBikes();
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
                        onBikeClick(bike.id); 
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

    useEffect(() => {
        if (userType !== "admin" || !socket) return;

        const updateBike = (data) => {
            const bike = bikes.find((bike) => bike.id === data.bike_id);
            if (bike) {
                bike.attributes = { ...bike.attributes, ...data };
                setBikes([...bikes]);
            }
        };

        socket.on("bike_update", updateBike);
        return () => {
            socket.off("bike_update", updateBike);
        };
    }, [socket, bikes, userType]);

    if (loading) return <p>Loading...</p>;

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
            {zones.map((zone) => {
                const wkt = new Wkt.Wkt();
                try {
                    wkt.read(zone.wkt);
                    const leafletPolygon = wkt.toObject(L);
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
    userType: PropTypes.string.isRequired,
    socket: PropTypes.object,
    onBikeClick: PropTypes.func.isRequired,
};

export default MapView;
