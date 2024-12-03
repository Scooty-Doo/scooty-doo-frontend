"use strict";

import m from "mithril";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon-2x.png";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

var map;

const mapView = {
    view: function() {
        return [
            m("h1", "Map"),
            m("div#map.map", "")
        ];
    }
};

export default mapView;
