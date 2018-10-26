import BoxWizard from './BoxWizard';
import {BoxGeometry} from 'three';
import schema from './boxOpSchema';
import primitivePreviewer from '../primitivePreviewer';

function createBox(params, services) {
  let mDatum = params.datum && services.cadRegistry.findDatum(params.datum);

  return {
    outdated: mDatum ? [mDatum] : [],
    created: []
  }
}

export default {
  id: 'BOX',
  label: 'Box',
  icon: 'img/cad/cube',
  info: 'creates new object box',
  paramsInfo: ({width, height, depth}) => `(${width}, ${height}, ${depth})`,
  previewer: primitivePreviewer(() => new BoxGeometry(), ({width: dx, height: dy, depth: dz}) => ({dx, dy, dz})),
  form: BoxWizard,
  schema
};

