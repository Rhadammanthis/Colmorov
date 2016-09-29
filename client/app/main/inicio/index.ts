'use strict';
const angular = require('angular');
import InicioController from './inicio.controller';

export default angular.module('colmorovApp.inicio', [])
  .controller('InicioController', InicioController)
  .name;