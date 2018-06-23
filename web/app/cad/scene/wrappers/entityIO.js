import {readBrep} from '../../../brep/io/brepIO';
import {MShell} from '../../model/mshell';

export function readShellEntityFromJson(data) {
  return new MShell(readBrep(data));  
}