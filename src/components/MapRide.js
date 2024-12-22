import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../styles/HistoryRideClient.module.css";

const MapRide = ({ pathCoordinates }) => {
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={pathCoordinates[0] || [0, 0]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={pathCoordinates} color="blue" />
      </MapContainer>
    </div>
  );
};

export default MapRide;
