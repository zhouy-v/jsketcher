import TPI from './tpi';
import {MShell} from '../model/mshell';

/*
 * TPI stands for the Test Program Interface
 */
export function activate({bus, services}) {

  function addShellOnScene(shell, skin) {
    const sceneSolid = new MShell(shell);
    addOnScene(sceneSolid, skin);
    return sceneSolid;
  }
  function addOnScene(sceneSolid, skin) {
    services.cadRegistry.update(null, [sceneSolid]);
    services.viewer.render();
  }
  services.tpi = Object.assign({
    bus,
    services,
    addShellOnScene,
    addOnScene
  }, TPI);
}