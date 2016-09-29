'use strict';
const angular = require('angular');
import CambiarController from './cambiar.controller';

export default angular.module('colmorovApp.cambiar', [])
  .controller('CambiarController', CambiarController)
  .name;