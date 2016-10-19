import { Map, EventHandlerFn } from 'leaflet';
import { InfoButtonView} from './views';
import { InfoModel} from './models';
declare var L : any; // horrible hack.
declare var $ : any; // horrible hack.


export interface InfoOptions {
  layer: any;
  subLayerNumber: Number;
}

export class InfoController {
  model: InfoModel;
  buttonView: InfoButtonView;
  map: Map;

  getMapFunction(layer : any, subLayerNumber: Number) {
    /* return function(e : any) {
      let original_sql = layer.getSubLayer(subLayerNumber).getSQL();
      let q = "SELECT cartodb_id FROM (" + original_sql+ ") a WHERE ST_Intersects(the_geom, ST_Buffer(ST_GeomFromText('POINT(" + e.latlng.lng+ " " + e.latlng.lat + ")',4326), 0.0002))";
      let sqlURL = layer.options.sql_api_protocol + '://' +
            layer.options.user_name + '.' +
            layer.options.sql_api_domain + ':' +
            layer.options.sql_api_port +
            layer.options.sql_api_endpoint;
      let requestUrl = sqlURL + '?q=' + encodeURIComponent(q);
      $.getJSON(requestUrl, function(data : any) {
        $.each(data.rows, function(key : any, value : any) {
          console.log(value);
        });
      });
    }*/
    let self = this;
    return function(e: any) {
      self.map.openPopup(L.popup().setLatLng(e.latlng).setContent('<p>Test</p>'));
    }
  }

  mapClickFunction : EventHandlerFn;

  constructor(element: HTMLElement, map: Map, options: InfoOptions) {
    this.model = new InfoModel(this);
    this.buttonView = new InfoButtonView(this, element);
    this.map = map;
    this.mapClickFunction = function(e: any) {
      map.openPopup(L.popup().setLatLng(e.latlng).setContent('<p>Test</p>'));
    }
  }

  getToolActive() : boolean {
    return this.model.isActive;
  }

  deactivateTool() {
    this.map.getContainer().style.cursor = this.model.cursorBeforeActive
    this.model.cursorBeforeActive = '';
    this.map.off('click', this.mapClickFunction);
    this.model.isActive = false;
    console.log('Infobox tool is no longer active.')
  }

  activateTool() {
    this.model.cursorBeforeActive = this.map.getContainer().style.cursor;
    this.map.getContainer().style.cursor = 'crosshair';
    this.map.on('click', this.mapClickFunction);
    this.model.isActive = true;

    console.log('Infobox tool is now active.')
  }
}
