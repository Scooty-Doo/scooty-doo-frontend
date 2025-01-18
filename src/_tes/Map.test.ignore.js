/* istanbul ignore file */
/* eslint-env jest */

import React from "react";
import { render, screen } from "@testing-library/react";
import MapView from "../components/Map";
import '@testing-library/jest-dom';
import PropTypes from 'prop-types';

// Mocka Leaflet och dess komponenter
jest.mock('react-leaflet', () => {
    const MapContainer = ({ children }) => <div data-testid="map-container">{children}</div>;
    MapContainer.propTypes = {
        children: PropTypes.node.isRequired,
    };

    const TileLayer = () => <div data-testid="tile-layer" />;

    const Marker = ({ position }) => <div data-testid="marker" data-position={position} />;
    Marker.propTypes = {
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
    };

    const Popup = ({ children }) => <div data-testid="popup">{children}</div>;
    Popup.propTypes = {
        children: PropTypes.node.isRequired,
    };

    const Polygon = ({ positions }) => (
        <div data-testid="polygon" data-positions={JSON.stringify(positions)} />
    );
    Polygon.propTypes = {
        positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))).isRequired,
    };

    return {
        MapContainer,
        TileLayer,
        Marker,
        Popup,
        Polygon,
        useMap: jest.fn(),
    };
});

describe('MapView Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('visar "Loading" medan data laddas', () => {
        render(<MapView userType="user" onBikeClick={() => {}} />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
