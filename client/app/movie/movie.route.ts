'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/movie/:id', {
      template: '<movie-info></movie-info>'
    });
}