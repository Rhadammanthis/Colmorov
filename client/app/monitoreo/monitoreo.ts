'use strict';
const angular = require('angular');
const ngRoute = require('angular-route'); 


import routing from './monitoreo.routes';
import personal from './personal/personal.component';
import agenda from './agenda/agenda.component';
// import editar from './agenda/editar/editar.component.ts';
import {MonitoreoService} from './monitoreo.service.ts';

export default angular.module('yuniusApp.monitoreo', [
    ngRoute,

    personal,
    agenda
    ])
    .factory('Personal',MonitoreoService)
    .config(routing)
    .name;