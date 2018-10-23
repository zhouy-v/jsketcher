import {View} from './view';
import DatumObject3D from '../../craft/datum/datumObject';
import {DATUM} from '../entites';
import {setAttribute} from 'scene/objectData';
import {Mesh, MeshBasicMaterial, PolyhedronGeometry, SphereGeometry} from 'three';
import {CSYS_SIZE_MODEL} from '../../craft/datum/csysObject';

export default class DatumView extends View {

  constructor(datum, viewer, beginOperation) {
    super(datum);

    class MenuButton extends Mesh {
      
      constructor() {
        super(new SphereGeometry( 1 ), new MeshBasicMaterial({
          transparent: true,
          opacity: 0.5,
          color: 0xFFFFFF,
          visible: false
        }));
        this.scale.multiplyScalar(CSYS_SIZE_MODEL * 0.2);
      }
      
      dispose() {
        this.geometry.dispose();
        this.material.dispose();
      }

      onMouseEnter() {
        this.material.color.setHex(0xFBB4FF);
        viewer.requestRender();
      }

      onMouseLeave() {
        this.material.color.setHex(0xFFFFFF);
        viewer.requestRender();
      }


      onMouseDown() {
        this.material.color.setHex(0xB500FF);
        viewer.requestRender();
      }
      
      onMouseUp() {
        this.material.color.setHex(0xFBB4FF);
        viewer.requestRender();
      }
    }
    
    class StartingOperationDatumObject3D extends DatumObject3D {

      operationStarted = false;

      constructor(csys, viewer) {
        super(csys, viewer);
        this.affordanceArea = new AffordanceBox();
        this.menuButton = new MenuButton();
        this.csysObj.add(this.affordanceArea);
        this.csysObj.add(this.menuButton);
      }
      
      dragStart(e, target, hits) {
        if (target === this.affordanceArea || target === this.menuButton || hits.find(h => h.object === this.menuButton)) {
          return true;
        }
        if (!this.operationStarted) {
          beginOperation('DATUM_MOVE', {
            datum: datum.id
          });
          this.operationStarted = true;
        }
        super.dragStart(e, target);
      }

      onMouseMoveRaycast(hits) {
        let aff = false;
        let menu = false;
        // let axisHandle = false;
        hits.forEach(hit => {
          if (hit.object === this.affordanceArea) {
            aff = true;
          // } else if (hit.object === this.csysObj.xAxis.handle 
          //   || hit.object === this.csysObj.yAxis.handle 
          //   || hit.object === this.csysObj.zAxis.handle) {
          //   axisHandle = true;
          } else if (hit.object === this.menuButton) {
            menu = true;
          }
        });
        let prev = this.menuButton.material.visible;
        this.menuButton.material.visible = (aff || menu) && !this.operationStarted;
        if (prev !== this.menuButton.material.visible) {
          viewer.requestRender();
        }
      }
      
      dispose() {
        super.dispose();
        this.affordanceArea.dispose();
        this.menuButton.dispose();
      }
    }
    this.rootGroup = new StartingOperationDatumObject3D(datum.csys, viewer);
    
    setAttribute(this.rootGroup, DATUM, this);
    setAttribute(this.rootGroup, View.MARKER, this);
  }

  dispose() {
    super.dispose();
    this.rootGroup.dispose();
  }
}

class AffordanceBox extends Mesh {
  
  constructor() {
    super(new PolyhedronGeometry(
      [0,0,0, 1,0,0, 0,1,0,  0,0,1],
      [0,2,1, 0,1,3, 0,3,2, 1,2,3]
    ), new MeshBasicMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0xAA8439,
      visible: false
    }));
    
    let size = CSYS_SIZE_MODEL * 1.5;
    let shift = -(size - CSYS_SIZE_MODEL) * 0.3;
    this.scale.set(size, size, size);
    this.position.set(shift, shift, shift);
  }
  
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}