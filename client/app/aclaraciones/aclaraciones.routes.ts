'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/aclaraciones/pe', {
      template: '<aclaracionespe></aclaracionespe>',
      authenticate: 'pe'
    })
    .when('/aclaraciones/pe/chat', {
        template: '<chat></chat>',
    });
}
