'use strict';
const angular = require('angular');
const ngRoute = require('angular-route'); 


import routing from './main.routes';
import cambiar from './cambiar';
import recuperar from './recuperar';
import home from './home/home.controller';
import signup from './signup/signup.controller';
import login from './login/login.controller';

export default angular.module('colmorovApp.main', [
    ngRoute,

    home,
    signup,
    login
])
    .config(routing)
    .run(function($rootScope) {
      'ngInject';
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.name === 'logout' && current && current.originalPath && !current.authenticate) {
          next.referrer = current.originalPath;
        }
      });
    })

    .name;