import {InfoController} from './controllers';
declare var L : any; // horrible hack.

export class InfoButtonView {
  controller: InfoController;
  mainElement: HTMLElement;
  buttonElement: HTMLElement;

  constructor(controller: InfoController, element: HTMLElement) {
    this.mainElement = element;
    this.buildInterface();
    this.controller = controller;
  }

  buildInterface() {
    var self = this;
    this.buttonElement = document.createElement('a');
    this.buttonElement.innerText = 'i';
    this.buttonElement.style.fontFamily = "serif";
    this.buttonElement.style.fontWeight = "bold";
    this.buttonElement.setAttribute('href','#');
    this.buttonElement.className = "leaflet-control-cartodb-infoboxplus-icon";
    L.DomEvent.disableClickPropagation(this.buttonElement);
    this.buttonElement.onclick = function(e) {
      if (self.controller.getToolActive()) {
        self.controller.deactivateTool();
      } else {
        self.controller.activateTool();
      };
    }
    this.mainElement.appendChild(this.buttonElement);
  }
}
