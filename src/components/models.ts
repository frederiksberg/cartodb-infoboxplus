import {InfoController} from './controllers'

export class InfoModel {
  isActive: boolean;
  cursorBeforeActive: string;
  selectedFeatureIds: number[];
  controller: InfoController;

  constructor(controller: InfoController) {
    this.controller = controller;
  }
}
