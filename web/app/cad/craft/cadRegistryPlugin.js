import {EDGE, FACE, SKETCH_OBJECT} from '../scene/entites';
import {stream} from 'lstream';
import {MShell} from '../model/mshell';


export function activate({streams, services}) {

  streams.cadRegistry = {
    update: stream()
  };
  
  let shellIndex = new Map();
  
  function getAllShells() {
    return Array.from(shellIndex.values());
  }

  function update(toRemove, toAdd) {
    if (toRemove) {
      toRemove.forEach(shell => {
        shellIndex.delete(shell.id);
      });
    }
    if (toAdd) {
      toAdd.forEach(shell => {
        shellIndex.set(shell.id, shell);
      });
    }
    services.viewer.render();
    streams.cadRegistry.update.next();
  }
  
  function reset() {
    MShell.ID_COUNTER = 0;
    update(getAllShells());
  }

  function findFace(faceId) {
    let shells = getAllShells();
    for (let shell of shells) {
      for (let face of shell.faces) {
        if (face.id === faceId) {
          return face;
        }
      }
    }
    return null;
  }

  function findEdge(edgeId) {
    let shells = getAllShells();
    for (let shell of shells) {
      for (let edge of shell.edges) {
        if (edge.id === edgeId) {
          return edge;
        }
      }
    }
    return null;
  }

  function findSketchObject(sketchObjectGlobalId) {
    let [faceId, sketchObjectId] = sketchObjectGlobalId.split('/');
    let face = findFace(faceId);
    if (face) {
      return face.findById(sketchObjectGlobalId);
    }
    return null;
  }

  function findEntity(entity, id) {
    switch (entity) {
      case FACE: return findFace(id);
      case EDGE: return findEdge(id);
      case SKETCH_OBJECT: return findSketchObject(id);
      default: throw 'unsupported';
    }
  }
  
  services.cadRegistry = {
    getAllShells, update, reset, findFace, findEdge, findSketchObject, findEntity, shellIndex
  }
}


