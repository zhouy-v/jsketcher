import {Matrix3} from './l3space';

export default class Datum {
  
  constructor(origin, normal, dir) {
    this.origin = origin;
    this.x = dir;
    this.y = normal.cross(dir);
    this.z = normal;
  }
  
  get inTransformation() {
    if (!this._inTr) {
      const basis = new Matrix3().setBasis([this.x, this.y, this.z]);
      const translate = new Matrix3();
      translate.tx = this.origin.x;
      translate.ty = this.origin.y;
      translate.tz = this.origin.z;
      this._inTr = basis.combine(translate);
    }
    return this._inTr;
  }

  get outTransformation() {
    if (!this._outTr) {
      this._outTr = this.inTransformation().invert();
    }
    return this._outTr;
  }
}