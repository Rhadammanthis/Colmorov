'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/monitoreo/personal', {
        template: '<personal></personal>',
        authenticate: 'pe'
      });/*
      .when('/monitoreo/mapa', {
        template: '<mapa></mapa>',
        authenticate: 'pe'
      })
      .when('/monitoreo/agenda', {
        template: '<agenda></agenda>',
        authenticate: 'pe'
      })
      .when('/monitoreo/agenda/editar', {
        template: '<editar></editar>',
        authenticate: 'pe'
      });*/
}
