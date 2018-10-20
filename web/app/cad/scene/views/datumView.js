import {View} from './view';
import DatumObject3D from '../../craft/datum/datumObject';
import {DATUM, SHELL} from '../entites';
import {setAttribute} from '../../../../../modules/scene/objectData';

export default class DatumView extends View {

  constructor(datum, viewer, beginOperation) {
    super(datum);

    class StartingOperationDatumObject3D extends DatumObject3D {
      
      operationStarted = false;
      
      dragStart(e, target) {
        if (!this.operationStarted) {
          beginOperation('DATUM_MOVE', {
            datum: datum.id
          });
          this.operationStarted = true;
        }
        super.dragStart(e, target);  
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

