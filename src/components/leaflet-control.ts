import { Control, ControlPosition, ControlOptions, Map } from 'leaflet';
import { InfoController } from './controllers';
declare var L : any; // horrible hack

export interface InfoBoxPlusOptions extends ControlOptions {
  layer: any;
  sublayerNumber: number;
  pixelBuffer?: number;
  noDataMessage?: string;
  autostart?: boolean;

}

export class InfoBoxPlusControl implements Control {
  options: InfoBoxPlusOptions
  controller: InfoController;

  setPosition = L.Control.prototype.setPosition;
  getPosition = L.Control.prototype.getPosition;
  addTo = L.Control.prototype.addTo;
  remove = L.Control.prototype.remove;
  removeFrom = L.Control.prototype.removeFrom; // Works with older leaflets
  getContainer = L.Control.prototype.getContainer;

  onAdd(map: Map): HTMLElement {
    let controlElement = document.createElement('div');
    controlElement.className = 'leaflet-control-cartodb-infoboxplus leaflet-bar leaflet-control';
    L.DomEvent.disableClickPropagation(controlElement);

    this.controller = new InfoController(controlElement, map, {
      layer: this.options.layer,
      sublayerNumber: this.options.sublayerNumber,
      pixelBuffer: (this.options.pixelBuffer == null) ? 5 : this.options.pixelBuffer,
      noDataMessage: (this.options.noDataMessage == null) ? 'No data at this location.' : this.options.noDataMessage,
      autostart: (this.options.autostart == null) ? false : this.options.autostart
    });

    return controlElement;
  }

  onRemove(map: Map): void {
    // Do nothing
  }

  constructor(options: InfoBoxPlusOptions) {
    this.options = options;
    if (!options.position) {
      this.options.position = 'topright';
    }

  }


}
