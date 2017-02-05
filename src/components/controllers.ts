import { Map, EventHandlerFn, Layer } from 'leaflet';
import { InfoButtonView, InfoListView, InfoMapLayerView } from './views';
import { InfoModel} from './models';
declare var L : any; // horrible hack.

export interface InfoOptions {
  layer: any;
  sublayerNumber: number;
  objectField: string;
  heading: string;
  pixelBuffer: number;
  noDataMessage: string;
  autostart: boolean;
}

export class InfoController {
  model: InfoModel;
  buttonView: InfoButtonView;
  listView: InfoListView;
  mapLayerView: InfoMapLayerView;
  mapClickFunction : EventHandlerFn;

  constructor(element: HTMLElement, map: Map, options: InfoOptions) {
    this.model = new InfoModel(this);
    this.model.controlElement = element;
    this.buttonView = new InfoButtonView(this);
    this.listView = new InfoListView(this);
    this.model.map = map;
    this.model.layer = options.layer;
    this.model.objectField = options.objectField;
    this.model.sublayer = options.layer.getSubLayer(options.sublayerNumber)
    this.model.noDataMessage = options.noDataMessage;
    this.model.template = this._stripCartoTemplate(this.model.sublayer.infowindow.attributes.template);
    this.model.heading = options.heading;
    this.mapLayerView = new InfoMapLayerView(this);

    let model = this.model;
    let mapLayerView = this.mapLayerView;
    this.model.map.on('popupclose', function(e: any) {
      mapLayerView.clearData();
    });
    this.mapClickFunction = function(e: any) {
      model.getFeatures(e.latlng, map.getZoom(),5);
      model.activePopup = L.popup().setLatLng(e.latlng);
      model.activePopup.setContent('<p>Venter på data ...</p>');
      map.openPopup(model.activePopup);
    }
    if (options.autostart) {
      this.activateTool();
    }
  }

  createListClickFunction(feature: any, listIndex: number) : EventHandlerFn {
    let self = this;
    return function(e: any) {
      self.listView.updatePopup(feature, self.model.template);
      self.mapLayerView.showFeature(JSON.parse(feature.geojson));
      self.listView.updateActiveListItem(listIndex);
    };
  }

  setPopupContent(popup_html: string) {
    this.model.activePopup.setContent(popup_html);
    this.model.activePopup.openOn(this.model.map);
  }

  addLayerToMap(layer: Layer) {
    this.model.map.addLayer(layer);
  }

  featuresUpdated() {
    if (this.model.selectedFeatures.length > 1) {
      this.model.controlElement.className += ' leaflet-control-cartodb-infoboxplus-expanded';
      this.listView.buildList(this.model.selectedFeatures);
      this.listView.show();
      this.buttonView.showHeading(this.model.heading);
    } else {
      this.listView.hide();
      this.buttonView.hideHeading();
    }
    let popup_html: string;
    if (this.model.selectedFeatures.length > 0) {
      this.listView.updatePopup(this.model.selectedFeatures[0], this.model.template)
      this.mapLayerView.showFeature(JSON.parse(this.model.selectedFeatures[0].geojson));
    } else {
      popup_html = this.model.noDataMessage;
    }
    this.model.activePopup.setContent(popup_html);
  }
  getControlElement() {
    return this.model.controlElement;
  }

  getToolActive() : boolean {
    return this.model.isActive;
  }

  getTemplate() : string {
    return this.model.template;
  }

  deactivateTool() {
    this.model.map.getContainer().style.cursor = this.model.cursorBeforeActive
    this.model.cursorBeforeActive = '';
    this.model.layer.setInteraction(this.model.interactionBeforeActive);
    this.model.map.off('click', this.mapClickFunction);
    this.listView.emptyList();
    let newClass = this.model.controlElement.className.replace(' leaflet-control-cartodb-infoboxplus-expanded','');
    this.model.controlElement.className = newClass;
    this.listView.hide();
    this.buttonView.hideHeading();
    this.model.isActive = false;
    console.log('Infobox tool is no longer active.')
  }

  activateTool() {
    this.model.cursorBeforeActive = this.model.map.getContainer().style.cursor
    this.model.interactionBeforeActive = this.model.layer.interactionEnabled[0]
    this.model.layer.setInteraction(false)
    this.model.map.getContainer().style.cursor = 'crosshair';
    this.model.map.on('click', this.mapClickFunction);
    this.model.isActive = true;
    console.log('Infobox tool is now active.')
  }

  getObjectField() {
    return this.model.objectField;
  }
  private _stripCartoTemplate(cartoHTML : string) : string{

    let carto_element = document.createElement('div');
    carto_element.innerHTML = cartoHTML;
    return carto_element.getElementsByClassName('cartodb-popup-content')[0].innerHTML;
  }
}
