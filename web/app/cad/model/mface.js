import {MObject} from './mobject';
import Vector from 'math/vector';
import {BasisForPlane} from '../../math/l3space';
import {MSketchObject} from './msketchObject';

export class MFace extends MObject {

  static TYPE = 'face';

  constructor(id, shell, brepFace) {
    super();
    this.id = id;
    this.shell = shell;
    this.brepFace = brepFace;
    this.sketchObjects = [];
  }

  normal() {
    return this.brepFace.surface.normalInMiddle();
  }

  depth() {
    return this.brepFace.surface.tangentPlaneInMiddle().w;
  }

  surface() {
    return this.brepFace.surface;
  }

  calcBasis() {
    return BasisForPlane(this.normal());
  };

  basis() {
    if (!this._basis) {
      this._basis = this.calcBasis();
    }
    return this._basis;
  }
  
  getBounds() {
    const bounds = [];
    for (let loop of this.brepFace.loops) {
      bounds.push(loop.asPolygon().map(p => new Vector().setV(p)));
    }
    return bounds;
  }

  setSketch(sketch) {
    this.sketchObjects = [];

    const addSketchObjects = sketchObjects => {
      let isConstruction = sketchObjects === sketch.constructionSegments;
      for (let sketchObject of sketchObjects) {
        let mSketchObject = new MSketchObject(this, sketchObject);
        mSketchObject.construction = isConstruction;
        this.sketchObjects.push(mSketchObject);
      }
    };
    addSketchObjects(sketch.constructionSegments);
    addSketchObjects(sketch.connections);
    addSketchObjects(sketch.loops);
  }

  findSketchObjectById(sketchObjectId) {
    for (let o of this.sketchObjects) {
      if (o.id === sketchObjectId) {
        return o;
      }
    }
  }

}