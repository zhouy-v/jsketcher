import {MObject} from './mobject';
import {MFace} from './mface';
import {MEdge} from './medge';
import {MVertex} from './mvertex';

export class MShell extends MObject {
  
  static TYPE = 'shell';
  
  static ID_COUNTER = 0;
  
  id = 'S:' + (MShell.ID_COUNTER++);
  shell;
  faces = [];
  edges = [];
  vertices = [];
  
  constructor(shell) {
    super();
    this.shell = shell;
    
    let faceCounter = 0;
    let edgeCounter = 0;
    let vertexCounter = 0;

    for (let brepFace of this.shell.faces) {
      const mFace = new MFace('F:' + faceCounter++, this, brepFace);
      this.faces.push(mFace);
    }

    for (let brepEdge of this.shell.edges) {
      const mEdge = new MEdge('E:' + edgeCounter++, this, brepEdge);
      this.edges.push(mEdge);
    }

    for (let brepVertex of this.shell.vertices) {
      const mVertex = new MVertex('V:' + vertexCounter++, this, brepVertex);
      this.vertices.push(mVertex);
    }
  }
}

export class MFuzzyFace extends MShell {}

