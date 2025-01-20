import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import styles from "../styles/MapDrawZones.module.css";
const API_BASE_URL = "http://localhost:8000/v1/zones/";

const MapWithZones = () => {
    const ZOOM_LEVEL = 13;
    const MAP_CENTER = [55.605, 13.0038];
    const mapRef = useRef();
    const oldZonesRef = useRef();
    const [mapLayers, setMapLayers] = useState([]);
    const [selectedZoneType, setSelectedZoneType] = useState(1);
    const [zoneName, setZoneName] = useState(""); 
    const [cityId, setCityId] = useState(1); 
    const [newZoneBoundary, setNewZoneBoundary] = useState(null);
    const [editingZoneId, setEditingZoneId] = useState(null);

    // Uppdatera karta när zoner ändras
    useEffect(() => {
        if (oldZonesRef.current) {
            oldZonesRef.current.clearLayers();
            mapLayers.forEach((layer) => {
                const polygon = new L.Polygon(layer.latlngs, {
                    id: layer.id, // Tilldelar id här
                    color: getZoneColor(layer.zone_type_id),
                    fillOpacity: 0.4,
                });
                oldZonesRef.current.addLayer(polygon);
            });
        }
    }, [mapLayers]);

    // Ladda zoner från api 
    const loadApiZones = useCallback((zoneData) => {
        if (!zoneData || !zoneData.id || !zoneData.attributes) {
            console.error("Invalid zone data format:", zoneData);
            return;
        }
    
        const existingZone = mapLayers.find((layer) => layer.id === zoneData.id);
        if (existingZone) {
            console.warn(`Zone with ID ${zoneData.id} already exists.`);
            return; // Skip if zone already exists
        }
    
        const { boundary, zone_type_id, zone_name, city_id } = zoneData.attributes;
        const latlngs = parseBoundary(boundary);
    
        setMapLayers((prevLayers) => [
            ...prevLayers,
            {
                id: zoneData.id,
                zone_type_id,
                isNew: false,
                zone_name: zone_name || "Unnamed Zone",
                city_id: city_id || 0,
                boundary,
                latlngs,
            },
        ]);
    }, [mapLayers]);

    // Hämta zondata från API
    // UseEffect with loadApiZones as a dependency
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await fetch(API_BASE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch zones: ${response.status}`);
                }

                const data = await response.json();
                data.data.forEach(loadApiZones);
            } catch (error) {
                console.error("Error fetching zones:", error);
            }
        };

        fetchZones();
    }, [loadApiZones]); 

    
    
    //omvandla polygon till lat-lng-koordinationer
    const parseBoundary = (boundary) => {
        if (!boundary || typeof boundary !== "string") {
            console.error("Invalid boundary:", boundary);
            return [];
        }
    
        return boundary
            .replace("POLYGON((", "")
            .replace("))", "")
            .split(",")
            .map((coord) => {
                const [lng, lat] = coord.trim().split(" ").map(parseFloat);
                if (isNaN(lat) || isNaN(lng)) {
                    console.error("Invalid coordinate in boundary:", coord);
                    return null;
                }
                return [lat, lng];
            })
            .filter((coord) => coord !== null); 
    };
    
    // Spara zonen (både ny eller uppdaterad)
    const handleSave = () => {
        if (!zoneName || !cityId || !newZoneBoundary) {
            alert("Please provide a Zone Name, City ID, and draw a zone on the map.");
            return;
        }
    
        const updatedZone = {
            zone_name: zoneName,
            zone_type_id: selectedZoneType,
            city_id: cityId,
            boundary: newZoneBoundary,
        };
    
        if (editingZoneId) {
            console.log("Updating zone:", editingZoneId, updatedZone);
            UpdateZone(editingZoneId, updatedZone);
        } else {
            console.log("Saving new zone:", updatedZone);
            createZone(updatedZone);
        }
    };
    
    // Funktion för att skapa ny zon
    const createZone = async (zoneData) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(zoneData),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API Response Error:", errorResponse);
                throw new Error(`Failed to create zone: ${response.status} - ${errorResponse.detail || 'Unknown error'}`);
            }
    
            const newZone = await response.json();
            console.log("API response for created zone:", newZone);
    
            loadApiZones(newZone.data);
            alert("Zone created successfully!");
        } catch (error) {
            console.error("Error creating zone:", error.message || error);
            alert("Failed to create zone. Check console for details.");
        }
    };

    // Uppdatera zon
    const UpdateZone = async (zoneId, zoneData) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}${zoneId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(zoneData),
            });
    
            if (!response.ok) {
                const errorResponse = await response.text();
                console.error("API Response Error:", errorResponse);
                throw new Error(`Failed to update zone: ${response.status} - ${errorResponse}`);
            }
    
            const updatedZone = await response.json();
            console.log("API response for updated zone:", updatedZone);

            setMapLayers((prevLayers) =>
                prevLayers.map((layer) =>
                    layer.id === zoneId
                        ? { ...layer, ...zoneData, latlngs: parseBoundary(zoneData.boundary) }
                        : layer
                )
            );
    
            alert("Zone updated successfully!");
            setEditingZoneId(null);
        } catch (error) {
            console.error("Error updating zone:", error.message || error);
            alert("Failed to update zone. Check console for details.");
        }
    };

    // Skapa ny zon (polygon)
    const handleCreated = (e) => {
        const { layerType, layer } = e;
        if (layerType === "polygon") {
            const latlngs = layer.getLatLngs()[0];
    
            if (latlngs[0] !== latlngs[latlngs.length - 1]) {
                latlngs.push(latlngs[0]);
            }
    
            const boundary = `POLYGON((${latlngs.map((coord) => `${coord.lng} ${coord.lat}`).join(', ')}))`;
            setNewZoneBoundary(boundary);
            console.log("New zone boundary created:", boundary);
        }
    };

    // Klicka på befintlig zon för redigering
    const handleZoneClick = (zoneId) => {
        const selectedZone = mapLayers.find((layer) => layer.id === zoneId);
        if (selectedZone) {
            setEditingZoneId(zoneId);
            setZoneName(selectedZone.zone_name);
            setSelectedZoneType(selectedZone.zone_type_id);
            setCityId(selectedZone.city_id);
            setNewZoneBoundary(selectedZone.boundary);
            console.log("Zone selected for editing:", selectedZone);
        }
    };
    
    // Hantera ändring av polygon
    const handleEdited = (e) => {
        const layers = e.layers;
    
        layers.eachLayer((layer) => {
            const updatedLatlngs = layer.getLatLngs()[0];
            
            if (updatedLatlngs[0] !== updatedLatlngs[updatedLatlngs.length - 1]) {
                updatedLatlngs.push(updatedLatlngs[0]);
            }
    
            const updatedBoundary = `POLYGON((${updatedLatlngs
                .map((coord) => `${coord.lng} ${coord.lat}`)
                .join(', ')}))`;
    
            const zoneId = layer.options?.id;
    
            if (!zoneId) {
                console.error("Zone ID is undefined during editing:", layer);
                return;
            }
    
            const updatedZone = {
                zone_name: zoneName,
                boundary: updatedBoundary,
            };
    
            console.log("Updated zone:", zoneId, updatedZone);
    
            UpdateZone(zoneId, updatedZone);
    
            setMapLayers((prevLayers) =>
                prevLayers.map((layer) =>
                    layer.id === zoneId
                        ? { ...layer, latlngs: updatedLatlngs, boundary: updatedBoundary }
                        : layer
                )
            );
        });
    };
    
    
    // Rendera zoner
    const renderZones = () => {
        return mapLayers.map((layer, index) => (
            <Polygon
                key={`${layer.id}-${index}`}
                positions={layer.latlngs}
                color={getZoneColor(layer.zone_type_id)}
                fillOpacity={0.4}
                eventHandlers={{
                    click: () => handleZoneClick(layer.id),
                }}
                options={{ id: layer.id }} 
            />
        ));
    };
    
    

    const getZoneColor = (type) => {
        switch (type) {
        case 1:
            return 'blue';
        case 2:
            return 'yellow';
        case 3:
            return 'red';
        case 4:
            return 'green';
        default:
            return 'gray';
        }
    };

    return (
        <>
            <div className={styles.headerC}>
                <h1> Create and Edit zones</h1>
            </div>
            <div className={styles.mapContainer}>
                <MapContainer
                    center={MAP_CENTER}
                    zoom={ZOOM_LEVEL}
                    ref={mapRef}
                    className={styles.map} // Lägg till CSS-klassen för kartan
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FeatureGroup ref={oldZonesRef}>
                        {renderZones()}
                        <EditControl
                            position="topright"
                            onCreated={handleCreated}
                            onEdited={handleEdited}
                            draw={{
                                polyline: false,
                                rectangle: false,
                                circle: false,
                                circlemarker: false,
                                marker: false,
                            }}
                            edit={{
                                featureGroup: oldZonesRef.current, // Tillåt redigering av befintliga zoner
                            }}
                        />
                    </FeatureGroup>
                    {renderZones()}
                </MapContainer>
            </div>
            <div className={styles.form}>
                <label className={styles.label}>
                    Select Zone Type:{' '}
                    <select
                        value={selectedZoneType}
                        onChange={(e) => setSelectedZoneType(parseInt(e.target.value, 10))}
                        className={styles.select}
                    >
                        <option value="1">Parking</option>
                        <option value="2">Slow</option>
                        <option value="3">Forbidden</option>
                        <option value="4">Charging</option>
                    </select>
                </label>
                <br />
                <label className={styles.label}>
                    Zone Name:{' '}
                    <input
                        type="text"
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        placeholder="Enter Zone Name"
                        className={styles.input}
                    />
                </label>
                <br />
                <label className={styles.label}>
                    City ID:{' '}
                    <input
                        type="number"
                        value={cityId}
                        onChange={(e) => setCityId(parseInt(e.target.value, 10))}
                        placeholder="Enter City ID"
                        className={styles.input}
                    />
                </label>
                <br />
                <button onClick={handleSave} className={styles.button}>Save Zone</button>
            </div>
        </>
    );
    
};

export default MapWithZones;
