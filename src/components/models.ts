import {Map, LatLng, Popup} from 'leaflet';
import {InfoController} from './controllers'
import * as $ from 'jquery'

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
  controller: InfoController;

  constructor(controller: InfoController) {
    this.controller = controller;
    this.selectedFeatures = [];
  }

  getFeatures(latlng: LatLng) {


    let original_sql = this.sublayer.getSQL();
//    let q = "SELECT cartodb_id, ledningstype FROM (" + original_sql+ ") a WHERE ST_Intersects(the_geom, ST_Buffer(ST_GeomFromText('POINT(" + latlng.lng+ " " + latlng.lat + ")',4326), 0.0002))"
    let q = "SELECT * FROM (" + original_sql+ ") a WHERE ST_Intersects(the_geom, ST_Buffer(ST_GeomFromText('POINT(" + latlng.lng+ " " + latlng.lat + ")',4326), 0.0002))"
    let sqlURL = this.layer.options.sql_api_protocol + '://' +
      this.layer.options.user_name + '.' +
      this.layer.options.sql_api_domain + ':' +
      this.layer.options.sql_api_port +
      this.layer.options.sql_api_endpoint;

    let requestUrl = sqlURL + '?q=' + encodeURIComponent(q);

    let self = this;
    $.getJSON(requestUrl, function(data) {
       console.log(data);
       if (data.rows.length > 0) {
         self.selectedFeatures = data.rows;
         self.controller.featuresUpdated();
       } else console.log('Nodata');
    })
  }
}
