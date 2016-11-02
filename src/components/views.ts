import {InfoController} from './controllers';
import { render } from 'mustache';
declare var L : any; // horrible hack.

export class InfoButtonView {
  controller: InfoController;
  buttonElement: HTMLElement;

  constructor(controller: InfoController) {
    this.controller = controller;
    this.buildInterface();
  }

  buildInterface() {
    var self = this;
    this.buttonElement = document.createElement('a');
    this.buttonElement.innerText = 'i';
    this.buttonElement.style.fontFamily = "serif";
    this.buttonElement.style.fontWeight = "bold";
    this.buttonElement.setAttribute('href','#');
    this.buttonElement.className = "leaflet-control-cartodb-infoboxplus-icon";
    this.buttonElement.onclick = function(e) {
      if (self.controller.getToolActive()) {
        self.controller.deactivateTool();
      } else {
        self.controller.activateTool();
      };
    }
    this.controller.getControlElement().appendChild(this.buttonElement);
  }
}

export class InfoListView {
  controller: InfoController;
  listElement: HTMLElement;
  isHidden: boolean;

  constructor(controller: InfoController) {
    this.controller = controller;
    this.buildInterface();
  }

  buildInterface() {
    let mainElement = this.controller.getControlElement()
    this.listElement = document.createElement('ul');
    this.listElement.style.display='none';
    this.listElement.className='leaflet-control-cartodb-infoboxplus-alternatives'
    mainElement.appendChild(this.listElement);
  };
  hide() {
    this.listElement.style.display='none';
  }
  show() {
    this.listElement.style.display='block';
  }
  emptyList() {
    while (this.listElement.firstChild) {
      this.listElement.removeChild(this.listElement.firstChild);
    }
  }

  buildList(features: any[]) {
    this.emptyList();
    let listElement = this.listElement;
    let self = this;
    features.forEach(function(feature: any, index: Number, array: any[]) {
      let listItem = document.createElement('li');
      let listLink = document.createElement('a');
      listItem.onclick = self.controller.createListClickFunction(feature);
      listLink.innerText = '' + (index.valueOf()+1) + '. ' + feature.ledningstype;
      listItem.appendChild(listLink);
      listElement.appendChild(listItem);
    });
  }

  updatePopup(feature: any, template: string) {
    let popup_html: string;
    popup_html = render(template,feature);
    this.controller.setPopupContent(popup_html)
  }
}
