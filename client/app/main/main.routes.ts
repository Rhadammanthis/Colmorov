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
    // .when('/registro', {
    //   template: require('./registrar/registro.html'),
    //   controller: 'RegistrarController',
    //   controllerAs: 'ac'
    // })
    // .when('/nueva', {
    //   template: require('./cambiar/nuevacontrasena.html'),
    //   controller: 'CambiarController',
    //   controllerAs: 'ac'
    //   /*template: 'Abrir ventana de nueva contraseña'*/
    // })
    // .when('/recuperar', {
    //   template: require('./recuperar/recuperarcontrasena.html'),
    //   controller: 'RecuperarController',
    //   controllerAs: 'ac'
    //   /*template: 'Abrir ventana de ingresar correo'*/
    // });
};

