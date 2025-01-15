import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import styles from '../styles/ZoneAdmin.module.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// List of things this component needs to be able to do
// create new zones and add them to the new zones array, Done but needs rename to newZones instead of just zones
// show a mock of previously already added zones, Done
// move those zones into a edited zones zone when zones get edited, Not Yet Done
// make it so that the zones when created or edited are in seperate created and edited zone arrays, NOT DONE
// this is so that when api adds zones we can take created zones and put them to the api
// and so we can patch the edited zones
// With above done we should be able to create AND edit the zones

// setup console.logs to check both newZones and editedZones

const MapWithZones = () => {
    const [zones, setZones] = useState([]);
    const [newZones] = useState([]);
    const [selectedZoneType, setSelectedZoneType] = useState('Parking');
    const [editedZones, setEditedZones] = useState([]);
    const selectedZoneTypeRef = useRef('Parking');
    // const zonesRef = useRef();

    // const mockZones = [
    //     {
    //         id: 1,
    //         name: 'Existing Zone 1',
    //         wkt: 'POLYGON((13.0038 55.605, 13.0108 55.610, 13.0158 55.605, 13.0038 55.605))',
    //         type: 'Parking',
    //     },
    //     {
    //         id: 2,
    //         name: 'Existing Zone 2',
    //         wkt: 'POLYGON((13.0208 55.600, 13.0308 55.605, 13.0358 55.600, 13.0208 55.600))',
    //         type: 'Slow',
    //     },
    // ];

    // useEffect(() => {
    // // Simulate fetching zones from API
    //     setZones(mockZones.map((zone) => ({
    //         ...zone,
    //         latlngs: parseWKT(zone.wkt),
    //     })));
    // }, []);

    // Update the ref whenever selectedZoneType changes
    useEffect(() => {
        selectedZoneTypeRef.current = selectedZoneType;
    }, [selectedZoneType]);

    useEffect(() => {
        console.log("New Zones updated: ", newZones);
    }, [newZones]);

    useEffect(() => {
        console.log("Edited Zones updated: ", editedZones);
    }, [editedZones]);

    // const parseWKT = (wkt) => {
    //     const coordinates = wkt
    //         .match(/\(\((.*)\)\)/)[1]
    //         .split(', ')
    //         .map((coord) => {
    //             const [lng, lat] = coord.split(' ').map(Number);
    //             return [lat, lng];
    //         });
    //     return coordinates;
    // };

    const handleCreated = (e) => {
        const layer = e.layer;
        const latlngs = layer.getLatLngs()[0];

        // Convert coordinates to WKT
        const wkt = `POLYGON((${latlngs
            .map((point) => `${point.lng} ${point.lat}`)
            .join(', ')}))`;

        setZones((prevZones) => {
            const newZone = {
                id: prevZones.length + 1,
                name: `New Zone ${prevZones.length + 1}`,
                wkt,
                type: selectedZoneTypeRef.current,
            };

            const updatedZones = [...prevZones, newZone];
            //   console.log("Updated Zones in setZones: ", updatedZones);
            return updatedZones;
        });

        // Set the style of the drawn layer
        const color =
      selectedZoneTypeRef.current === 'Parking'
          ? 'blue'
          : selectedZoneTypeRef.current === 'Slow'
              ? 'yellow'
              : selectedZoneTypeRef.current === 'Forbidden'
                  ? 'red'
                  : 'green';
        layer.setStyle({ color });

    // console.log("What color? ", color);
    // console.log("What Zone Type? ", selectedZoneTypeRef.current);
    };


    const handleEdited = (e) => {
        console.log("Edit Used: ");
        const layers = e.layers;
        const updatedZones = [];

        layers.eachLayer((layer) => {
            const latlngs = layer.getLatLngs()[0];
            const wkt = `POLYGON((${latlngs
                .map((point) => `${point.lng} ${point.lat}`)
                .join(', ')}))`;

            const id = layer.options.id;
            updatedZones.push({ id, latlngs, wkt });
        });

        setZones((prevZones) =>
            prevZones.map((zone) =>
                updatedZones.find((updated) => updated.id === zone.id) || zone
            )
        );

        setEditedZones((prev) => [...prev, ...updatedZones]);
    };

    const handleSave = () => {
        console.log("Edited Zones to Save: ", editedZones);
    };

    return (
        <>
            <div className={styles.container}>
                <label className={styles.label}>
                    Select Zone Type:
                    <select
                        className={styles.select}
                        value={selectedZoneType}
                        onChange={(e) => setSelectedZoneType(e.target.value)}
                    >
                        <option value="Parking">Parking</option>
                        <option value="Slow">Slow</option>
                        <option value="Forbidden">Forbidden</option>
                        <option value="Charging">Charging</option>
                    </select>
                </label>
                <button className={styles.button} onClick={handleSave}>
                    Save Zones
                </button>
            </div>
            <MapContainer
                className={styles.map}
                center={[55.605, 13.0038]}
                zoom={13}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup>
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
                    />
                    {zones.map((zone) =>
                        Array.isArray(zone.latlngs) && zone.latlngs.length > 0 ? (
                            <Polygon
                                key={zone.id}
                                positions={zone.latlngs}
                                color={
                                    zone.type === 'Parking'
                                        ? 'blue'
                                        : zone.type === 'Slow'
                                        ? 'yellow'
                                        : zone.type === 'Forbidden'
                                        ? 'red'
                                        : 'green'
                                }
                                pathOptions={{ id: zone.id }}
                            />
                        ) : null
                    )}
                </FeatureGroup>
            </MapContainer>
        </>
    );
    
};

export default MapWithZones;
