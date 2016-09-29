/**
 * Buscar model events
 */

'use strict';

import {EventEmitter} from 'events';
import Buscar from './buscar.model';
var BuscarEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BuscarEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Buscar.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BuscarEvents.emit(event + ':' + doc._id, doc);
    BuscarEvents.emit(event, doc);
  }
}

export default BuscarEvents;
