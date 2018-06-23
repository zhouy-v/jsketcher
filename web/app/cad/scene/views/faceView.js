import {View} from './view';
import {setAttribute} from '../../../../../modules/scene/objectData';
import {brepFaceToGeom, tessDataToGeom} from '../wrappers/brepSceneObject';
import {FACE} from '../entites';
import * as SceneGraph from '../../../../../modules/scene/sceneGraph';
import {SceneSketchObject} from '../wrappers/sceneObject';
import {SketchObject} from '../../../sketcher/shapes/sketch-object';
import {SketchObjectView} from './sketchObjectView';

export class FaceView extends View {
  
  constructor(face, geom) {
    super(face);
    this.meshFaces = [];
    this.sketchGroup = SceneGraph.createGroup();
    this.sketchObjectViews = [];
    
    let off = geom.faces.length;
    if (face.brepFace.data.tesselation) {
      tessDataToGeom(face.brepFace.data.tesselation.data, geom)
    } else {
      brepFaceToGeom(face, geom);
    }
    for (let i = off; i < geom.faces.length; i++) {
      const meshFace = geom.faces[i];
      face.meshFaces.push(meshFace);
      setAttribute(meshFace, FACE, this);
    }
  }
  
  updateSketch(sketchObjects) {
    SceneGraph.clearGroup(this.sketchGroup);
    this.disposeSketch();

    let surface = this.object.surface();
    const _3dTransformation =  surface.tangentPlaneInMiddle().get3DTransformation();

    for (let sketchObject of sketchObjects) {
      let sov = new SketchObjectView(sketchObject, _3dTransformation);
      SceneGraph.addToGroup(this.sketchGroup, sov);
    }
  }
  
  disposeSketch() {
    for (let sov of this.sketchObjectViews) {
      sov.dispose();
    }
  }
  
  dispose() {
    this.disposeSketch();
  }
}