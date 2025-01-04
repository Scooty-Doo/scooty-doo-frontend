import React from 'react';
import PropTypes from 'prop-types';
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

RideDetails.propTypes = {
    rideHistory: PropTypes.shape({
        data: PropTypes.shape({
            attributes: PropTypes.shape({
                start_time: PropTypes.string.isRequired,
                end_time: PropTypes.string.isRequired,
                total_fee: PropTypes.number.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    formatTime: PropTypes.func.isRequired,
};
  
export default RideDetails;
  