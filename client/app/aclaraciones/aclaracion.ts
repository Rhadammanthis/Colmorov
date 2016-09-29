'use strict';
const angular = require('angular');
const ngRoute = require('angular-route'); 


import routing from './aclaraciones.routes';
import personal from './personal/personal.component';
import chat from './chat/chat.component';

export default angular.module('colmorovApp.aclaraciones', [
    ngRoute,

    personal,
    chat
    ])
    .config(routing)
    .name;