import schema from './rotateDatumOpSchema';
import {MDatum} from '../../../model/mdatum';
import {NOOP} from 'gems/func';
import RotateDatumWizard from './RotateDatumWizard';
import {Matrix3, ORIGIN} from '../../../../math/l3space';
import {DEG_RAD} from '../../../../math/math';


function rotate(params, {cadRegistry}) {
  
  let mDatum = cadRegistry.findDatum(params.datum);

  let csys = mDatum.csys.clone();

  applyRotation(csys, params.angle, params.axis.toLowerCase());

  return {
    outdated: [mDatum],
    created: [new MDatum(csys)]
  }
}

let originalBasis = new Matrix3();
let auxMatrix = new Matrix3();

function previewer(ctx, initialParams, updateParams) {

  let mDatum = ctx.services.cadRegistry.findDatum(initialParams.datum);
  
  if (!mDatum) {
    return null;
  }
  let view = mDatum.ext.view;
  if (!view) {
    return null;
  }

  let datum3D = view.rootGroup;
  datum3D.beginOperation(true);

  originalBasis = new Matrix3().setBasisAxises(mDatum.csys.x, mDatum.csys.y, mDatum.csys.z);

  function update(params) {
    applyRotation(datum3D.csys, params.angle, params.axis.toLowerCase());
  }

  function dispose() {
    datum3D.csys.copy(mDatum.csys);
    datum3D.finishOperation();
  }


  update(initialParams);

  return {
    update, dispose
  }
}

function applyRotation(csys, angle, axisProp) {
  let axis = csys[axisProp];
  auxMatrix.rotate(angle * DEG_RAD, axis, ORIGIN);
  originalBasis.combine(auxMatrix, auxMatrix);
  csys.x.set(auxMatrix.mxx, auxMatrix.myx, auxMatrix.mzx);
  csys.y.set(auxMatrix.mxy, auxMatrix.myy, auxMatrix.mzy);
  csys.z.set(auxMatrix.mxz, auxMatrix.myz, auxMatrix.mzz);
}

export default {
  id: 'DATUM_ROTATE',
  label: 'Rotate Datum',
  icon: 'img/cad/plane',
  info: 'rotates a datum',
  paramsInfo: ({axis, angle}) => `${axis} - ${angle}`,
  previewer,
  run: rotate,
  form: RotateDatumWizard,
  schema
};



