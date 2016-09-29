'use strict';
const angular = require('angular');
import SignupController from './signup.controller';

export default angular.module('yuniusApp.signup', [])
    .controller('SignupController', SignupController)
    .name;
