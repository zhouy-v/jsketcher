import {addModification} from './craftHistoryUtils';
import {state} from 'lstream';

export function activate({streams, services}) {

  let modificationsStream = state({
    history: [],
    pointer: -1
  });

  streams.craft.modifications = modificationsStream;

  function isAdditiveChange({history, pointer}, {history:oldHistory, pointer:oldPointer}) {
    if (pointer < oldPointer) {
      return false;
    }
    
    for (let i = 0; i <= oldPointer; i++) {
      let modCurr = history[i];
      let modPrev = oldHistory[i];
      if (modCurr !== modPrev) {
        return false;
      }
    }
    return true;    
  }

  let prev = modificationsStream.value;
  modificationsStream.attach(curr => {
    let beginIndex;
    if (isAdditiveChange(curr, prev)) {
      beginIndex = prev.pointer + 1;
    } else {
      services.cadRegistry.reset();
      beginIndex = 0;
    }
    let {history, pointer} = curr;
    for (let i = beginIndex; i <= pointer; i++) {
      modifyInternal(history[i]);
    }
    prev = curr;
  });


  function modifyInternal(request) {
    let op = services.operation.registry[request.type];
    if (!op) return `unknown operation ${request.type}`;

    let result = op.run(request.params, services);

    services.cadRegistry.update(result.outdated, result.created);
  }

  function modify(request) {
    modificationsStream.update(modifications => addModification(modifications, request));
  }
  
  function reset(modifications) {
    modificationsStream.next({
      history: modifications,
      pointer: modifications.length - 1
    });
  }
  
  services.craft = {
    modify, reset
  }
}

