'use strict';
const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');
import 'angular-socket-io';
const ngRoute = require('angular-route');
const ngMaterial = require('angular-material');
const ngAngularLoadingbar = require('angular-loading-bar')
const ngResponsiveParallax = require('angular-responsive-parallax')
const ngTable = require('angular-material-data-table');
const angularGrid = require('angularGrid');

// const ngMessages = require('angular-messages');
// import ngValidationMatch from 'angular-validation-match';


import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import list from './list/list.component';
import profile from './profile/profile.component';
import main from './main';



import './app.css';

angular.module('colmorovApp', [
  ngCookies,
  ngResource,
  ngSanitize,

  'btford.socket-io',

  ngRoute,
  ngMaterial,
  ngTable,
  ngAngularLoadingbar,
  ngResponsiveParallax,
  angularGrid,

  _Auth,
  navbar,
  list,
  profile,
  main,
  footer,
  constants,
  socket,
  util
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  })
  .service('editarService', function() {
    'ngInject';
    this.userData = {yearSetCount: 0};

    this.user = function() {
          return this.userData;
    };

    this.setCdgev = function(cdgev) {
          this.userData.cdgev = cdgev;
    };

    this.getCdgev = function() {
          return this.userData.cdgev;
    };

    this.setCdgcl = function(cdgcl) {
          this.userData.cdgcl = cdgcl;
    };

    this.getCdgcl = function() {
          return this.userData.cdgcl;
    };

    this.setCdgclns = function(cdgclns) {
          this.userData.cdgclns = cdgclns;
    };

    this.getCdgclns = function() {
          return this.userData.cdgclns;
    };

    this.setCdgns = function(cdgns) {
          this.userData.cdgns = cdgns;
    };

    this.getCdgns = function() {
          return this.userData.cdgns;
    };

    this.setNombre = function(nombre) {
          this.userData.nombre = nombre;
    };

    this.getNombre = function() {
          return this.userData.nombre;
    };

    this.setDescripcion = function(descripcion) {
          this.userData.descripcion = descripcion;
    };

    this.getDescripcion = function() {
          return this.userData.descripcion;
    };

    this.setDireccion = function(direccion) {
          this.userData.direccion = direccion;
    };

    this.getDireccion = function() {
          return this.userData.direccion;
    };

    this.setLocalizacion = function(localizacion) {
          this.userData.localizacion = localizacion;
    };

    this.getLocalizacion = function() {
          return this.userData.localizacion;
    };

    this.setSetCount = function(setCount) {
          this.userData.yearSetCount = setCount;
    };

    this.getSetCount = function() {
          return this.userData.yearSetCount;
    };
  })
  .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('teal');
})
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['colmorovApp'], {
      strictDi: true
    });
  });
