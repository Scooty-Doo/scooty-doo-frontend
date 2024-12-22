import styles from "../styles/HistoryRideClient.module.css";

const RideDetails = ({ rideHistory, formatTime }) => {
    return (
      <div className={styles.rideDetails}>
        <p>
          <strong>
            {new Date(rideHistory.data.attributes.start_time).toLocaleDateString()}
            , {formatTime(rideHistory.data.attributes.start_time)} -{" "}
            {formatTime(rideHistory.data.attributes.end_time)}
          </strong>
        </p>
        <p>
          <strong>Pris:</strong> {rideHistory.data.attributes.total_fee} kr
        </p>
      </div>
    );
  };
  
  export default RideDetails;
  