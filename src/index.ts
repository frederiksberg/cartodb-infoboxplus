import { InfoModel } from "./components/models"
import { InfoController } from "./components/controllers"
import { InfoButtonView } from "./components/views"
import * as L from 'leaflet';

let map = L.map('map').setView([55.684, 12.52], 13);
L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
}).addTo(map);

let mapElement = map.getContainer();
let controlContainer = mapElement.getElementsByClassName("leaflet-top leaflet-left")[0]
let infoButtonElement = document.createElement('div');
infoButtonElement.className = 'leaflet-control-cartodb-infoboxplus leaflet-bar leaflet-control';
// infoButtonElement.style = "vackground-image: url(https://unpkg.com/leaflet@1.0.1/dist/images/icons-000000@2x.png); background-repeat: no-repeat; background-size: 26px 260px;"
controlContainer.appendChild(infoButtonElement);

let infoController = new InfoController(infoButtonElement, map, {layer: {}, subLayerNumber: 1});
