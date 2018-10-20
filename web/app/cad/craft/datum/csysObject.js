import {Geometry, Line, LineBasicMaterial, MeshLambertMaterial, Object3D, Quaternion, Vector3} from 'three';
import {AXIS} from '../../../math/l3space';
import {MeshArrow} from 'scene/objects/auxiliary';
import {OnTopOfAll} from 'scene/materialMixins';

export default class CSysObject3D extends Object3D {

  constructor(csys, sceneSetup) {
    super();
    
    this.csys = csys;
    this.sceneSetup = sceneSetup;

    function createBasisArrow(axis, color) {
      return new MeshArrow(axis, color, SIZE_MODEL, 30, 15, 2, p => new MeshLambertMaterial( p ));
    }

    this.xAxis = createBasisArrow(AXIS.X, 0xFF0000);
    this.yAxis = createBasisArrow(AXIS.Y, 0x00FF00);
    this.zAxis = createBasisArrow(AXIS.Z, 0x0000FF);

    this.add(this.xAxis);
    this.add(this.yAxis);
    this.add(this.zAxis);
  }

  updateMatrix() {
    let {origin: o, x, y, z} = this.csys;

    let k = this.viewScaleFactor();
    this.matrix.set(
      k*x.x, k*y.x, k*z.x, o.x,
      k*x.y, k*y.y, k*z.y, o.y,
      k*x.z, k*y.z, k*z.z, o.z,
          0,     0,     0,   1
    );

    // this.scale.set(k, k, k);
    // super.updateMatrix();
  }

  viewScaleFactor() {
    let container = this.sceneSetup.container;
    let viewHeight = container.clientHeight;
    let camera = this.sceneSetup.camera;

    if (camera.isOrthographicCamera) {
      return viewHeight / (camera.top - camera.bottom)  / camera.zoom * 2;
    } else {
      let p = new Vector3().copy(this.csys.origin);
      let cp = new Vector3().copy(camera.position);
      let z = p.sub(cp).length();
      let tanHFov = Math.atan((camera.fov / 2) / 180 * Math.PI);
      let fitUnits = tanHFov * z * 2;

      let modelTakingPart = SIZE_MODEL / fitUnits;
      let modelActualSizePx = viewHeight * modelTakingPart;
      return SIZE_PX / modelActualSizePx;
    }
  }
  
  dispose() {
    this.children.forEach(c => c.dispose());
  }
}

const SIZE_MODEL = 100;

const SIZE_PX = 50;
