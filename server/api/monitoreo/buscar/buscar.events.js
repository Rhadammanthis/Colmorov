/**
 * BuscaMonitoreos model events
 */

'use strict';

import {EventEmitter} from 'events';
import BuscaMonitoreos from './buscar.model';
var BuscaMonitoreosEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BuscaMonitoreosEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  BuscaMonitoreos.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BuscaMonitoreosEvents.emit(event + ':' + doc._id, doc);
    BuscaMonitoreosEvents.emit(event, doc);
  }
}

export default BuscaMonitoreosEvents;
