/*'use strict';
const angular = require('angular');

import TablaBase from '../../../components/object/tabla/TablaBase';

/**
* Personal que tiene registrados monitoreos.
*
* @class PersonalComponent
* @constructor
*/
/**
* Método para obtener el personal que tiene registrados monitoreos, regresa 20 registros cada vez que se hace la
* petición al WS.
*
* @method getlista()
*
* Método que llena la lista del personal cada que se hace una petición al webservice.
*
* @method  llenaLista()
*
* Método que asigna al rootScope la selección hecha al hacer click a una de las filas de la lista y lo muestra en consola.
*
* @method  logItem(item)
*
*/
/**
* Esta propiedad almacena la posición para obtener los siguientes elementos si lo regresa la respuesta.
* 
* @property $scope.siguiente
* @type {Int}
*
* Esta propiedad almacena el arreglo que contiene al personal con monitoreos registrados.
* 
* @property $scope.lista
* @type {Array}
*
* Esta propiedad almacena el total de registros que regresa la petición.
* 
* @property $scope.total
* @type {Int}
*
* Esta propiedad almacena el arreglo que contiene al personal con monitoreos registrados la primera vez que se accede a la pantalla
* 
* @property $scope.personal
* @type {Array}
*
* Esta propiedad almacena las páginas accedidas para que ya no se vuelva a realizar la petición al WS
* 
* @property $scope.paginasAccedidas
* @type {Array}
*
* Esta propiedad almacena la fila seleccionada de la lista al hacer click.
* 
* @property $rootScope.selected
* @type {String}
*/
/*class PersonalComponent extends TablaBase{

    $location: any;
    $mdDialog: any;
    $mdMedia: any; 

    constructor($rootScope, $scope, $http, $location, $mdDialog, $mdMedia) {
      super($scope,'api/monitoreo/personal',{},$http);
      this.$location = $location;
      this.$mdDialog = $mdDialog;
      this.$mdMedia = $mdMedia;  
    }

    $onInit(){
      this.on(function(){
        console.log('Hola desde la funcion');
      });
      //console.log('Totales',parseInt(this.Monitoreo.getTotal()));
    }
}//Class

export default angular.module('yuniusApp.monitoreo.personal',[])
  .component('personal', {
    template: require('./mapa.html'),
    controller: PersonalComponent,
    controllerAs: 'pe'
  })
  .name;*/