import React, { useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../../styles/HistoryRideClient.module.css";


const ridehistory = [
  {
    bike_id: 77,
    user_id: "652134919185249773",
    start_time: "2024-02-17T05:35:18.719376",
    end_time: "2024-02-17T05:38:56.519376",
    start_position: "POINT (13.0678199999999993 55.5778589999999966)",
    end_position: "POINT (13.1000470000000000 55.5503399999999985)",
    path_taken:
      "LINESTRING(13.06782 55.57786,13.06787 55.57785,13.07128 55.57756,13.0713 55.57767,13.07141 55.57799,13.07145 55.5781,13.07162 55.5788,13.07188 55.57876,13.07307 55.57858,13.07436 55.57839,13.07524 55.57822,13.07659 55.57793,13.07708 55.57779,13.07726 55.57772,13.07759 55.5776,13.07783 55.5775,13.07807 55.57739,13.07829 55.57727,13.07884 55.57697,13.07928 55.57672,13.07956 55.57657,13.07983 55.57645,13.08014 55.57631,13.08054 55.57616,13.08093 55.57604,13.08133 55.57592,13.08178 55.57582,13.08226 55.57573,13.08341 55.57556,13.08405 55.57547,13.08464 55.57538,13.08505 55.57531,13.08534 55.57525,13.08561 55.57518,13.08585 55.57511,13.08618 55.57498,13.08658 55.57481,13.08648 55.5747,13.08639 55.5746,13.08634 55.57454,13.08633 55.5745,13.0863 55.57438,13.08616 55.57374,13.08596 55.57291,13.08572 55.57194,13.08553 55.5711,13.08529 55.5701,13.08511 55.56931,13.08498 55.5686,13.08496 55.56838,13.08494 55.56819,13.08495 55.56792,13.08496 55.5676,13.085 55.56729,13.08506 55.56692,13.08507 55.56686,13.08512 55.56671,13.08533 55.5662,13.08546 55.56597,13.08579 55.56546,13.0862 55.56495,13.0865 55.56462,13.08684 55.56429,13.08706 55.5641,13.08724 55.56397,13.08744 55.56385,13.08761 55.56376,13.08784 55.56365,13.08804 55.56356,13.0883 55.56346,13.08866 55.56334,13.08942 55.56316,13.08978 55.56311,13.09019 55.56306,13.09093 55.56297,13.09137 55.56291,13.09144 55.56289,13.09174 55.56283,13.09211 55.56275,13.09245 55.56266,13.093 55.56247,13.09338 55.56232,13.0938 55.56215,13.09438 55.56191,13.09521 55.56159,13.09631 55.56112,13.09829 55.56032,13.1001 55.55957,13.10176 55.55889,13.10303 55.55839,13.10355 55.55817,13.10397 55.55801,13.10477 55.5577,13.10425 55.5573,13.10324 55.55662,13.10312 55.55653,13.10229 55.55601,13.10138 55.55549,13.10062 55.55506,13.10033 55.55491,13.09983 55.55467,13.09929 55.55442,13.09819 55.55391,13.09782 55.55375,13.09775 55.55372,13.09787 55.55361,13.09829 55.55329,13.09884 55.55279,13.09917 55.55252,13.09889 55.55239,13.09857 55.55231,13.098 55.55229,13.09764 55.55233,13.09762 55.55229,13.09745 55.55193,13.0974 55.55183,13.09818 55.55142,13.09875 55.55103,13.09915 55.55074,13.09935 55.5506,13.09972 55.55037,13.09997 55.55027,13.10005 55.55034)",
    total_fee: 10.89,
  },
];

// Hämta tid
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return `${String(date.getHours()).padStart(2, "0")}.${String(date.getMinutes()).padStart(2, "0")}`;
};

// Hämta rutt 
const parsePath = (path) => 
  path.replace("LINESTRING (", "")
      .replace(")", "")
      .split(",")
      .map((pair) => pair.trim().split(" ").map(Number))
      .map(([lng, lat]) => [lat, lng]);

// Hitta centrum av rutten för att kunna visa upp rätt på kartan
const calculateCenter = (path) => {
  const coordinates = parsePath(path);
  const latitudes = coordinates.map(coord => coord[0]);
  const longitudes = coordinates.map(coord => coord[1]);
  return [
    latitudes.reduce((acc, lat) => acc + lat, 0) / latitudes.length,
    longitudes.reduce((acc, lng) => acc + lng, 0) / longitudes.length,
  ];
};

const Ride = () => (
  <div className={styles.historyContainer}> 
    <h1>Din resa</h1>
    <div className={styles.history}>
      {ridehistory.map((ride, index) => {
        const pathCenter = calculateCenter(ride.path_taken);
        return (
          <div key={index} className={styles.historyItem}>
            {/* Karta visas först */}

            <div className={styles.rideDetails}>
              <p><strong>{new Date(ride.start_time).toLocaleDateString()},  {formatTime(ride.start_time)} - {formatTime(ride.end_time)}</strong></p>
            </div>
            <div className={styles.mapContainer}>
              <MapContainer center={pathCenter} zoom={13} style={{ height: "200px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={parsePath(ride.path_taken)} />
              </MapContainer>
            </div>
            <div className={styles.rideDetails}>
              <p><strong>Pris:</strong> {ride.total_fee} kr</p>
            </div>
            {/* Textinformation visas nedanför */}
          </div>
        );
      })}
    </div>
  </div>

);


export default Ride;
