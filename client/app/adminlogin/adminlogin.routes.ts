'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/adminlogin', {
      template: '<adminlogin></adminlogin>'
    });
}
