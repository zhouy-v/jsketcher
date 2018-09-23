import {Viewer} from '../../sketcher/viewer2d';
import {IO} from '../../sketcher/io';
import {AddSegmentTool} from '../../sketcher/tools/segment';
import {DelegatingPanTool, PanTool} from '../../sketcher/tools/pan';
import {Matrix4} from 'three/src/math/Matrix4';
import {ORIGIN} from '../../math/l3space';

export class InPlaceSketcher {
  
  constructor() {
  }

  enter(viewer3d, face) {
    this.viewer3d = viewer3d;
    this.face = face;
    this.syncWithCamera();
    
    let container = viewer3d.sceneSetup.container;
    let canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.right = 0;
    canvas.style.bottom = 0;

    container.appendChild(canvas);
    this.viewer = new Viewer(canvas, IO);
    this.viewer.toolManager.defaultTool = new DelegatingPanTool(this.viewer, viewer3d.sceneSetup.renderer.domElement);
    this.viewer.toolManager.takeControl(new AddSegmentTool(this.viewer, true));
    // this.viewer.toolManager.takeControl(new PanTool(this.viewer))
    viewer3d.sceneSetup.trackballControls.addEventListener( 'change', this.onCameraChange);
  }

  exit() {
    this.viewer3d.sceneSetup.trackballControls.removeEventListener( 'change', this.onCameraChange);
    this.face = null;
    this.viewer3d = null;
    this.viewer.dispose();
    this.viewer.canvas.parentNode.removeChild(this.viewer.canvas);
  }

  onCameraChange = () => {
    this.syncWithCamera();
    this.viewer.refresh();
  };

  syncWithCamera() {
    let face = this.face;
    let sceneSetup = this.viewer3d.sceneSetup;
    
    _projScreenMatrix.multiplyMatrices( sceneSetup.oCamera.projectionMatrix,
      sceneSetup.oCamera.matrixWorldInverse );

    let [x, y, z] = face.basis();
    let sketchToWorld = face.sketchToWorldTransformation;
    let sketchOrigin = sketchToWorld.apply(ORIGIN);

    let o = ORIGIN.three().applyMatrix4(_projScreenMatrix);
    let xx = x.three().applyMatrix4(_projScreenMatrix);
    let yy = y.three().applyMatrix4(_projScreenMatrix);

    sketchOrigin = sketchOrigin.three().applyMatrix4(_projScreenMatrix);

    let width = sceneSetup.container.clientWidth;
    let height = sceneSetup.container.clientHeight;

    xx.sub(o);
    yy.sub(o);
    //
    // console.log(JSON.stringify(xx))
    // console.log(JSON.stringify(yy))

    window.TRS = [xx.x * width, xx.y * height, yy.x * width, yy.y* height,
      (sketchOrigin.x) * width + width,
      (sketchOrigin.y) * height + height, sceneSetup.oCamera.zoom];

  };
}

let _projScreenMatrix = new Matrix4();