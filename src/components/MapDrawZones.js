import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

    // fråga vilhelm om double mounting workarounds (och med hjälp att se om det är double mounting som är problemet)

    // Ny strategi?
    // Istället för alla arrays så använder vi det inbyggda layers och om layeren är från fetchen så har vi en flagga som säger så
    // om flagan är true (från old fetch) så patchas arrayen om den är editad (behöver flagga för edited?)
    // om flagan är false (från hanldeCreated) så postas zonen. (se till att den zon som blir postad är den nyaste varianten av den zonen)

    // Vad saknar zone CRUD?
    // fungerande handleEdit som inte skapar duplicates
    // se till att handleSaved fungerar
    // Lägg till att man kan skriva in ett namn i ett fält över kartan som assignas som nyskapade zoners namn. Om den är tom så används en default string av "Unnamed zone" (gör lika dant för vilket stads id som zonen ska få)
    // se till att inga edge cases inte fungerar

    // skapas duplicates för att vi inte tar bort layer från kartan?

    // tror att den nya strategien kan vara en breakthrough (blir lite omcodning då) (om vi kör på den så drar vi en copy av denna fil innan för säkerhetens skull)

    // lägg till en if statement i handleEdited för att se till att den bara editar polygons. (ifall handleEdited körs dubelt på grund av att den tar upp något som inte är en zone(men hur blir det en copia av samma zon då???))

    // aparently the polygon component is a scam and cannot be edited instead look into the draw plugin

    // ALLA KOMMENTARER UNDER DENHÄR ÄR KLARA
    // se till att selectedZoneType faktiskt påverkar vilket zone_type_id som nyskapade zones får (KLAR)



    // what do we need to fix after the overhaul?

    // fixed:
    // creat new zones, be able to edit and delete those new zones before sending them to api
    // readd the zones getting the correct zone color and correct zonetyping based on what selected zone type is selected
    // add a way to post created zones to api

    // probably fixed but not tested:
    // make sure that the new zones we can create are labled as new in their data for post/patch differencing

    // not fixed:
    // when a new zone is created then edited then saved and then edited and saved again then it becomes two different zones since the first saved zone makes it to the api and then the edited zone becomes a different zone that is edited
    // make sure the old zones are added to the layer so it can be edited
    // make sure that the old zones can be edited and deleted
    // make sure that the old zones are labled as old zones and labled if they have been edited or no for patching pourposes
    // figure out a way to send a delete request to api if zone has been deleted (just do in delete function using _zone_id?)

    // force refesh the page when saving zones?
    // fixa så att zoner kan editas (edit fins men det verkar inte updatera zonerna)
    const MapWithZones = () => {
    const ZOOM_LEVEL = 13;
    const MAP_CENTER = [55.605, 13.0038];
    const mapRef = useRef();
    const oldZonesRef = useRef();
    const [mapLayers, setMapLayers] = useState([]);
    const [oldZones, setOldZones] = useState([]);
    // const [newZones, setNewZones] = useState([]);
    // const [editedZones, setEditedZones] = useState([]);
    const [selectedZoneType, setSelectedZoneType] = useState(1);
    const selectedZoneTypeRef = useRef(1);
    // const newZonesRef = useRef(newZones);
    // const editedZonesRef = useRef(editedZones);
    // const oldZonesRef = useRef(oldZones);

    useEffect(() => {
        selectedZoneTypeRef.current = selectedZoneType;
    }, [selectedZoneType]);

        // Fetch old zones from backend
        useEffect(() => { // flytta ut ur useEffect och in i något annat? useEffect kommmer nog overrida oldZone när den inte borde. (är teorin åtminstone)
            const fetchZones = async () => { // move to zones api? (maya har redan fixat zone api kansek kan använda den)
                try {
                    const response = await fetch('http://localhost:8000/v1/zones/');
                    const data = await response.json();

                    setOldZones(data.data.map((zone) => ({ // old stinky code to test a thing
                        id: zone.id,             // Include id
                        type: zone.type,         // Include type
                        attributes: zone.attributes, // Include attributes
                        links: zone.links        // Include links
                    })));
                    console.log("fetched old zones",data);


                    const parsedZones = data.data.map((zone) => ({
                        id: zone.id,
                        latlngs: parseWKTPolygon(zone.attributes.boundary),
                        zone_type_id: zone.attributes.zone_type_id,
                    }));
                    console.log("parsedZones",parsedZones);
                    addZonesToMap(parsedZones);
                } catch (error) {
                    console.error("Failed to fetch zones:", error);
                }
            };
                fetchZones();
        }, []);

    function parseWKTPolygon(wkt) {
        // Extract the coordinates from the WKT string (inside the "(())")
        const coordinatesString = wkt.match(/\(\((.*?)\)\)/)[1]; // Extracts the coordinates part
        return coordinatesString.split(",").map(coord => {
            const [lon, lat] = coord.trim().split(" "); // Split each pair of coordinates
            return [parseFloat(lat), parseFloat(lon)]; // Return as [latitude, longitude]
        });
    }

    const handleCreated = (e) => {
        console.log("CREATED E: ",e)

        const { layerType, layer } = e;
        if (layerType === "polygon") {
            const {_leaflet_id} = layer;

            // Get the color based on the current selected zone type
            const zoneColor = getZoneColor(selectedZoneTypeRef.current);

            // for labeling new zones as new
            const isNew = true;

            const coordinates = layer.getLatLngs()[0];
            console.log("LatLngs formatt: ",layer.getLatLngs());
            const firstCoordinate = coordinates[0];

            coordinates.push(firstCoordinate);
            const boundary = `POLYGON((${coordinates.map(coord => `${coord.lng} ${coord.lat}`).join(', ')}))`;

            // Set the style of the layer (polygon)
            layer.setStyle({
                color: zoneColor,
                fillColor: zoneColor,
            });

            setMapLayers((layers) => [
                ...layers,
                {
                    id:_leaflet_id,
                    zone_type_id: selectedZoneTypeRef.current,
                    isNew: isNew,
                    zone_name: "default name",
                    city_id: 0,
                    boundary: boundary,
                    latlngs: layer.getLatLngs(),
                },
            ]);
        }
    };

    const handleEdited = (e) => {
        console.log("EDITED E: ",e)

        const { layers: { _layers } } = e; // get data from edited zone/zones

        Object.values(_layers).map(({ _leaflet_id, editing }) => { // if edited zone matches the zone id then we update latlngs
            setMapLayers((layers) =>
                layers.map((l) => l.id === _leaflet_id
                    ? {...l, latlngs: { ...editing.latlngs[0] } } 
                    : l
                )
            );
        });
    };

    const handleSave = async () => {
        try {
            // Iterate over each layer in mapLayers and post them one by one
            for (const layer of mapLayers) {
                console.log("AAAAAAAAAAAAAA",layer.latlngs);
                const formattedPoints = `POLYGON((${layer.latlngs[0].map(point => `${point.lng} ${point.lat}`).join(', ')}))`;
                console.log("HELL: ",formattedPoints);
                const zoneData = {
                    zone_name: layer.zone_name,
                    zone_type_id: layer.zone_type_id,
                    city_id: 1, // temp way to get city id
                    boundary: formattedPoints, // WKT format
                };
                console.log("ZoneData from saved: ",zoneData);
                console.log("ZoneData JSON.Stringify from saved: ",JSON.stringify(zoneData));

                const response = await fetch('http://localhost:8000/v1/zones/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(zoneData),
                });

                // Handle the response for each request
                if (!response.ok) {
                    console.error('Failed to save zone:', zoneData, response.status, response.statusText);
                    alert(`Failed to save zone: ${zoneData.zone_name}. Please try again.`);
                    return; // Stop further requests if one fails
                }
            }

            // If all requests succeed
            console.log('All zones saved successfully.');
            alert('All zones saved successfully!');
        } catch (error) {
            console.error('Error while saving zones:', error);
            alert('An error occurred. Please try again.');
        }
        window.location.reload(); // Force reloading page to avoid weird save then edit interactions
    };

    const handleDeleted = (e) => {
        console.log("DELETED E: ",e);
        const {
            layers: { _layers },
         } = e; // get data from deleted zone/zones

        Object.values(_layers).map(({ _leaflet_id }) => { // getting leaflet id to match against zones we have to delete them
            setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
        });
    };

    const getZoneColor = (type) => { // move to utils?
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

// Function to add zones to the map
const addZonesToMap = (zones) => {
    const featureGroup = oldZonesRef.current;

    console.log("Adding zones to the map:", zones); // Log the zones being added
    console.log("Feature group before adding zones:", featureGroup);

    // // Update mapLayers with the new zones
    // const newMapLayers = zones.map((zone) => {
    //     const polygon = L.polygon(zone.latlngs, {
    //         color: getZoneColor(zone.zone_type_id),
    //         fillColor: getZoneColor(zone.zone_type_id),
    //         fillOpacity: 0.5,
    //         boundary: zone.latlngs,
    //     });

    //     polygon.options = {
    //         ...polygon.options,
    //         zoneId: zone.id,
    //         isNew: false,
    //         zone_type_id: zone.zone_type_id,
    //         boundary: zone.boundary,
    //     };

    //     featureGroup.addLayer(polygon);
    //     console.log("Added polygon with options:", polygon.options); // Log polygon options after creation

    //     return {
    //         id: polygon._leaflet_id, // Unique ID for each polygon
    //         zone_type_id: zone.zone_type_id,
    //         isNew: false,
    //         zone_name: zone.name || "default name", // Assuming zone has a name property
    //         city_id: zone.city_id || 0, // Assuming zone has a city_id property
    //         boundary: `POLYGON((${zone.latlngs[0].map(coord => `${coord.lng} ${coord.lat}`).join(', ')}))`, // Generate boundary as POLYGON
    //         latlngs: zone.latlngs,
    //     };
    // });

    // Update the mapLayers state with the new zones
    // setMapLayers((layers) => [...layers, ...newMapLayers]);
    // map.addLayer(layer);
    console.log("Feature group after adding zones:", featureGroup); // Log feature group after all zones are added
};


    // console.log("Old Zones", oldZones);
    // console.log("Edited Zones", editedZones);
    // console.log("New Zones", newZones);
    return (
        <>
            <div style={{ padding: '10px' }}>
                <label>
                    Select Zone Type:{' '}
                    <select value={selectedZoneType} onChange={(e) => setSelectedZoneType(parseInt(e.target.value, 10))}>
                        <option value="1">Parking</option>
                        <option value="2">Slow</option>
                        <option value="3">Forbidden</option>
                        <option value="4">Charging</option>
                    </select>
                </label>
                <button onClick={handleSave}>Save Zones</button>
            </div>
            <MapContainer
            center={MAP_CENTER}
            zoom={ZOOM_LEVEL} ref={mapRef}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            style={{ height: '90vh', width: '100%' }
            }>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup ref={oldZonesRef}>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        onEdited={handleEdited}
                        onDeleted={handleDeleted}
                        draw={{
                            polyline: false,
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                        }}
                    />
                    {[...oldZones].map((zone) => (
                    <Polygon
                        key={zone.id}
                        positions={parseWKTPolygon(zone.attributes.boundary)} // Process boundary here
                        color={getZoneColor(zone.attributes.zone_type_id)} // Color based on zone type
                        pathOptions={{
                            zoneId: zone.id,
                            isNew: false,
                            edited: false,
                        }}
                    >
                        {/* Add a Popup that shows the zone name when clicked */}
                        <Popup>type id: {zone.attributes.zone_type_id}<br />{zone.attributes.zone_name}</Popup>
                    </Polygon>
                ))}

                </FeatureGroup>
            </MapContainer>
            <pre>{JSON.stringify( mapLayers, 0, 2 )}</pre>
        </>
    );
};

export default MapWithZones;
