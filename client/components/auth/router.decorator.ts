'use strict';

export function routerDecorator($rootScope, $location, Auth) {
  'ngInject';
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
  $rootScope.$on('$routeChangeStart', function(event, next) {
    if(!next.authenticate) {
      return;
    }

    if(next.authenticate === 'cl' && Auth.isLoggedAsUser()){
        return;
      }
      if(next.authenticate === 'pe' && Auth.isLoggedAsAdmi()){
        return;
      }
      Auth.logout();
      $location.path('/');
  });
};
