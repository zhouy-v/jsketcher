import Viewer from './viewer';
import CadScene from "./cadScene";

export function activate(context) {
  let {dom} = context.services;
  
  let viewer = new Viewer(context.bus, dom.viewerContainer);
  
  context.services.viewer = viewer;
  context.services.cadScene = new CadScene(viewer.sceneSetup.rootGroup);

  context.streams.cadRegistry.update.attach(createSceneSynchronizer(context));
}
