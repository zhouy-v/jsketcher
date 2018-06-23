import {box} from '../../../brep/brep-primitives'
import {BREPSceneSolid} from '../../scene/wrappers/brepSceneObject';
import {createBoxGeometry} from "scene/geoms";
import BoxWizard from './BoxWizard';
import {MShell} from '../../model/mshell';

function createBox({width, height, depth}) {
  return {
    outdated: [],
    created: [new MShell(box(width, height, depth))]
  }
}

export default {
  id: 'BOX',
  label: 'Box',
  icon: 'img/cad/cube',
  info: 'creates new object box',
  paramsInfo: ({width, height, depth}) => `(${width}, ${height}, ${depth})`,
  previewGeomProvider: ({width, height, depth}) => createBoxGeometry(width, height, depth),
  run: createBox,
  wizard: BoxWizard
};

