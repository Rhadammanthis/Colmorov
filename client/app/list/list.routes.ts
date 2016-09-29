'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/list', {
      template: '<list></list>'
    });
}