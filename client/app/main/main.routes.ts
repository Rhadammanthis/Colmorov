'use strict';

export default function routes($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/', {
      template: '<home></home>'
    })
    .when('/movies', {
      template: '<inicio></inicio>'
    })
    .when('/signup', {
      template: '<signup></signup>'
    })
    .when('/login', {
      template: '<login></login>'
    });
};

