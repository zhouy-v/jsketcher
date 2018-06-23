import {MObject} from './mobject';

export class MSketchObject extends MObject {

  static TYPE = 'sketchObject';
  
  constructor(face, sketchObject) {
    super();
    this.id = sketchObject.id;
    this.face = face;
    this.sketchObject = sketchObject;
    this.construction = false;
  }

}