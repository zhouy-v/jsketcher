import * as SceneGraph from 'scene/sceneGraph';
import {getAttribute} from 'scene/objectData';
import {SHELL} from './entites';
import {ShellView} from './views/shellView';

export function createShellSynchronizer({services: {cadScene, cadRegistry}}, viewIndex) {
  return function() {
    let wgChildren = cadScene.workGroup.children;
    let existent = new Set();
    for (let i = wgChildren.length - 1; i >= 0; --i) {
      let obj = wgChildren[i];
      let shellView = getAttribute(obj, SHELL);
      if (shellView) {
        let exists = cadRegistry.shellIndex.has(shellView.shell.id);
        if (!exists) {
          SceneGraph.removeFromGroup(cadScene.workGroup, obj);
          shellView.dispose();
        } else {
          existent.add(shellView.shell.id);
        }
      } 
    }

    let allShells = cadRegistry.getAllShells();

    for (let shell of allShells) {
      if (!existent.has(shell.id)) {
        let shellView = new ShellView(shell);
        SceneGraph.addToGroup(cadScene.workGroup, shellView.rootGroup);
      }
    }

    viewIndex.clear();
    for (let obj of cadScene.workGroup.children) {
      let shellView = getAttribute(obj, SHELL);
      if (shellView) {
        viewIndex.set(shellView.object, shellView);
        for (let faceView of shellView.faceViews) {
          viewIndex.set(faceView.object, faceView);
          faceView.disable();
        }
        for (let edgeView of shellView.edgeViews) {
          viewIndex.set(edgeView.object, edgeView);
          edgeView.disable();
        }
        for (let vertexView of shellView.vertexViews) {
          viewIndex.set(shellView.object, shellView);
          vertexView.disable();
        }
      }
    }
  }

}

export function createSketchSynchronizer({services: {cadScene, cadRegistry}}) {
  return function() {

    let wgChildren = cadScene.workGroup.children;
    let existent = new Set();
    for (let i = wgChildren.length - 1; i >= 0; --i) {
      let obj = wgChildren[i];
      let shellView = getAttribute(obj, 'ShellView');
      if (shellView) {
        let exists = cadRegistry.shellIndex.has(shellView.shell.id);
        if (!exists) {
          SceneGraph.removeFromGroup(cadScene.workGroup, obj);
          shellView.dispose();
        } else {
          existent.add(shellView.shell.id);
        }
      }
    }

    let allShells = cadRegistry.getAllShells();

    for (let shell of allShells) {
      if (!existent.has(shell.id)) {
        let shellView = new ShellView(shell);
        SceneGraph.addToGroup(cadScene.workGroup, shellView.group3d);
      }
    }
  }
}