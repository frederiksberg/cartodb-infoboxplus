"use strict";
var controllers_1 = require("./components/controllers");
var L = require("leaflet");
var map = L.map('map').setView([55.684, 12.52], 13);
L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
}).addTo(map);
var mapElement = map.getContainer();
var controlContainer = mapElement.getElementsByClassName("leaflet-top leaflet-left")[0];
var infoButtonElement = document.createElement('div');
infoButtonElement.className = 'leaflet-control-cartodb-infoboxplus leaflet-bar leaflet-control';
controlContainer.appendChild(infoButtonElement);
var infoController = new controllers_1.InfoController(infoButtonElement, map, { layer: {}, subLayerNumber: 1 });
//# sourceMappingURL=index.js.map