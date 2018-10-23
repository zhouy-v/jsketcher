import {findAncestor} from '../../../../../modules/scene/sceneGraph';

export function activate(context) {
  const {services, streams} = context;
  let domElement = services.viewer.sceneSetup.domElement();

  domElement.addEventListener('mousedown', mousedown, false);
  domElement.addEventListener('mouseup', mouseup, false);
  domElement.addEventListener('mousemove', mousemove, false);

  let toDrag = null;

  let performRaycast = e => services.viewer.raycast(e, services.viewer.sceneSetup.scene.children);
  
  function mousedown(e) {
    let handled = false;
    let hits = performRaycast(e);
    for (let hit of hits) {
      toDrag = findAncestor(hit.object, o => o.dragStart, true);
      if (toDrag) {
        if (!!toDrag.dragStart(e, hit.object, hits)) {
          continue
        }
        handled = true;
        services.viewer.sceneSetup.trackballControls.enabled = false;
      }
    }
    if (handled) {
      return;
    }
    
    for (let hit of hits) {
      let onDownReceiver = findAncestor(hit.object, o => o.onMouseDown, true);
      if (onDownReceiver) {
        if (!!onDownReceiver.onMouseDown(e, hit.object, hits)) {
          continue;
        }
      }
      break;
    }
  }

  function mouseup(e) {
    if (toDrag) {
      toDrag.dragDrop(e);
      toDrag = null;
      services.viewer.sceneSetup.trackballControls.enabled = true;
    } else {
      let hits = performRaycast(e);
      for (let hit of hits) {
        let onUpReceiver = findAncestor(hit.object, o => o.onMouseUp, true);
        if (onUpReceiver) {
          if (!!onUpReceiver.onMouseUp(e, hit.object, hits)) {
            continue;
          }
        }
        break;
      }
    }
  }

  let mouseEnteredObjects = new Set();

  function mousemove(e) {
    let hits = performRaycast(e);
    if (toDrag) {
      toDrag.dragMove(e);
    } else {
      let newMouseEnteredObjects = new Set();
      for (let hit of hits) {
        let obj = findAncestor(hit.object, o => o.onMouseEnter, true);
        if (!obj) {
          continue;
        }
        if (!mouseEnteredObjects.has(obj)) {
          obj.onMouseEnter(e, hit.object, hits);
        }
        newMouseEnteredObjects.add(obj);
      }
      Array.from(mouseEnteredObjects).forEach(o => {
        if (!newMouseEnteredObjects.has(o) && o.onMouseLeave) {
          o.onMouseLeave(e);
        }
      });
      mouseEnteredObjects.clear();
      mouseEnteredObjects = newMouseEnteredObjects;
    }
    services.viewer.sceneSetup.scene.traverseVisible(o => {
      if (o.onMouseMoveRaycast) {
        o.onMouseMoveRaycast(hits);
      }
    });
  }
}
