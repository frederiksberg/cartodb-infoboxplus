import {Map, LatLng, Popup} from 'leaflet';
import {InfoController} from './controllers'

export class InfoModel {
  controlElement: HTMLElement;
  isActive: boolean;
  cursorBeforeActive: string;
  interactionBeforeActive: boolean;
  selectedFeatures: any[];
  activePopup: Popup;
  map: Map;
  layer: any;
  sublayer: any;
  template: string;
  controller: InfoController;
  noDataMessage: string;

  constructor(controller: InfoController) {
    this.controller = controller;
    this.selectedFeatures = [];
  }

  getFeatures(latlng: LatLng, z: number, pixelBuffer: number) {
    let buffer = (pixelBuffer * 1.4)/Math.pow(2,z)
    let original_sql = this.sublayer.getSQL();
//    let q = "SELECT cartodb_id, ledningstype FROM (" + original_sql+ ") a WHERE ST_Intersects(the_geom, ST_Buffer(ST_GeomFromText('POINT(" + latlng.lng+ " " + latlng.lat + ")',4326), 0.0002))"
    let q = "SELECT ST_AsGeoJSON(the_geom) as geojson, * FROM (" + original_sql+ ") a WHERE ST_Intersects(the_geom, ST_Buffer(ST_GeomFromText('POINT(" + latlng.lng+ " " + latlng.lat + ")',4326), " + buffer + "))"
    let sqlURL = this.layer.options.sql_api_protocol + '://' +
      this.layer.options.user_name + '.' +
      this.layer.options.sql_api_domain + ':' +
      this.layer.options.sql_api_port +
      this.layer.options.sql_api_endpoint;

    let requestUrl = sqlURL + '?q=' + encodeURIComponent(q);

    let self = this;
    let req = new XMLHttpRequest();
    req.open("GET", requestUrl);
    req.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        self.selectedFeatures = JSON.parse(this.response).rows;
        self.controller.featuresUpdated();
      } else {
        // Error returned from the server;
      }
    }

    req.send();
  }
}
