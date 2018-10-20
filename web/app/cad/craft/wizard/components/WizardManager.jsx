import React from 'react';
import Wizard from './Wizard';
import connect from 'ui/connect';
import decoratorChain from 'ui/decoratorChain';
import mapContext from 'ui/mapContext';
import {finishHistoryEditing, stepOverriding} from '../../craftHistoryUtils';
import validateParams from '../../validateParams';
import {NOOP} from 'gems/func';
import {clone} from 'gems/objects';

function WizardManager({type, changingHistory, resolve, close, stepHistory, insertOperation, cancelHistoryEdit, applyWorkingRequest, validator}) {
  if (!type) {
    return null;
  }
  return <Wizard resolveOperation={resolve}
                 validator={validator}
                 onCancel={changingHistory ? cancelHistoryEdit : undefined}
                 onOK={applyWorkingRequest}
                 close={changingHistory ? NOOP : close}/>
}

export default decoratorChain(
  connect(streams => streams.wizard.effectiveOperation),
  mapContext((ctx, props) => ({
    close: ctx.services.wizard.close,
    validator: (params, schema) => validateParams(ctx.services, params, schema), 
    resolve: type => ctx.services.operation.get(type),
    cancelHistoryEdit: () => ctx.streams.craft.modifications.update(modifications => finishHistoryEditing(modifications)),
    applyWorkingRequest: ctx.services.wizard.applyWorkingRequest 
  }))
)
(WizardManager);
