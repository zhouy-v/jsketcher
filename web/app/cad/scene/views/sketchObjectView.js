import {View} from './view';
import {setAttribute} from 'scene/objectData';
import DPR from 'dpr';
import staticResource from 'scene/staticResource';
import {SKETCH_OBJECT} from '../entites';
import Vector from 'math/vector';

export class SketchObjectView extends View {
  
  constructor(sketchObject, _3dTransformation) {
    super(sketchObject);

    let material = sketchObject.construction ? SKETCH_CONSTRUCTION_MATERIAL : SKETCH_MATERIAL;
    let line = new THREE.Line(new THREE.Geometry(), material);
    setAttribute(line, SKETCH_OBJECT, this);
    const chunks = sketchObject.approximate(10);
    function addLine(p, q) {
      const lg = line.geometry;
      const a = _3dTransformation.apply(chunks[p]);
      const b = _3dTransformation.apply(chunks[q]);

      lg.vertices.push(a._plus(OFF_LINES_VECTOR).three());
      lg.vertices.push(b._plus(OFF_LINES_VECTOR).three());
    }
    for (let q = 1; q < chunks.length; q ++) {
      addLine(q - 1, q);
    }
    
    this.rootGroup = line;
  }
  
  dispose() {
    this.rootGroup.geometry.dispose();
  }
}

const OFF_LINES_VECTOR = new Vector();//normal.multiply(0); // disable it. use polygon offset feature of material

const SKETCH_MATERIAL = staticResource(new THREE.LineBasicMaterial({color: 0xFFFFFF, linewidth: 3/DPR}));
const SKETCH_CONSTRUCTION_MATERIAL = staticResource(new THREE.LineBasicMaterial({color: 0x777777, linewidth: 2/DPR}));
