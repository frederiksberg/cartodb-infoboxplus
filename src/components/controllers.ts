import { Map, EventHandlerFn } from 'leaflet';
import { InfoButtonView, InfoListView } from './views';
import { InfoModel} from './models';
import { render } from 'mustache';
declare var L : any; // horrible hack.
declare var $ : any; // horrible hack.


export interface InfoOptions {
  layer: any;
  sublayerNumber: Number;
}

export class InfoController {
  model: InfoModel;
  buttonView: InfoButtonView;
  listView: InfoListView;
  mapClickFunction : EventHandlerFn;

  constructor(element: HTMLElement, map: Map, options: InfoOptions) {
    this.model = new InfoModel(this);
    this.model.controlElement = element;
    this.buttonView = new InfoButtonView(this);
    this.listView = new InfoListView(this);
    this.model.map = map;
    this.model.layer = options.layer;
    this.model.sublayer = options.layer.getSubLayer(options.sublayerNumber)
    let model = this.model;
    this.mapClickFunction = function(e: any) {
      model.getFeatures(e.latlng);
      model.activePopup = L.popup().setLatLng(e.latlng);
      model.activePopup.setContent('<p>Venter på data ...</p>');
      map.openPopup(model.activePopup);
    }
  }
  featuresUpdated() {
    console.log(this.model.selectedFeatures);
    if (this.model.selectedFeatures.length > 1) {
      this.model.controlElement.className += ' leaflet-control-cartodb-infoboxplus-expanded';
      this.listView.buildList(this.model.selectedFeatures);
      this.listView.show();
    } else {
      this.listView.hide();
    }
    if (this.model.selectedFeatures.length > 0) {
      console.log(this.model.sublayer);
      console.log(this.model.sublayer.infowindow.attributes.template);
      console.log(this.model.selectedFeatures[0]);
      let popup_html = this._stripCartoTemplate(render(this.model.sublayer.infowindow.attributes.template,
                                                       this.model.selectedFeatures[0]));
      this.model.activePopup.setContent(popup_html);
    }
  }
  getControlElement() {
    return this.model.controlElement;
  }

  getToolActive() : boolean {
    return this.model.isActive;
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
  private _stripCartoTemplate(cartoHTML : string) : string{

    let carto_element = document.createElement('div');
    carto_element.innerHTML = cartoHTML;
    return carto_element.getElementsByClassName('cartodb-popup-content')[0].innerHTML;
  }
}
