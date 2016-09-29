'use strict';
const angular = require('angular');

import TablaBase from '../../../components/object/base/TablaBase';

/**
* Provides a controller that fetches dynamic 'Aclaraciones' and loads them into a table
*
* @class AclaracionesComponent
* @constructor
*/
class AclaracionesComponent extends TablaBase{

    buscar: string;

    /**
    * Angular service to parse the URL in the browser address bar 
    *
    * @property $location
    * @type any
    */
    $location: any;

    /**
    * Angular service to perform http requests 
    *
    * @property $http
    * @type any
    */
    $http: any;

    /**
    * Angular service that provides basic UI interaction
    *
    * @property $rootScope
    * @type any
    */
    $rootScope: any;

    constructor($rootScope, $scope, $cookies, $http, $location) {
      super($rootScope,$scope,$cookies,'api/aclaraciones/buscar',{},$http,'pearray');
      this._order = 'nombre';
      this.$location = $location;
      this.$rootScope = $rootScope;
      
      this.$rootScope.title = 'Aclaraciones de Personal';
    }

    /**
     * Funcion que se ejecuta cuando la pagina inicia
     */
    $onInit(){
      super.$onInit();
      this.initCallback();
      this.on(function(respuesta){
        console.log('Primeros datos listos',respuesta);
      });
    }

    public initCallback(){
      this.setReadyF(function(result){
        console.log('Siguiente ready',result);
      });
      this.setErrorF(function(error){
        console.log('Siguiente error',error);
      });
      this.setSelectF(function(item){
        console.log('Siguiente item',item);
      })
    }

    /**
    * Loads the selected aclaracion object's information into the Chat page
    *
    * @method showMessages
    * @param {Object} aclaracion The selected aclaracion object
    */
    showMessages = function (aclaracion) {
      var temp = {};
      temp.cdgacl = aclaracion.id.cdgacl;
      temp.tipo = aclaracion.tipo;
      temp.fregistro = aclaracion.fregistro;
      temp.estado = aclaracion.estado;

      console.log('Object');
      console.log(temp);
      console.log('String');
      console.log(JSON.stringify(temp));

      this.saveDataTemp(JSON.stringify(temp));
      this.$location.path('/aclaraciones/pe/chat');
    };


}


export default angular.module('colmorovApp.aclaraciones.pe', [])
  .component('aclaracionespe', {
    template: require('./personal.html'),
    controller: AclaracionesComponent,
    controllerAs: 'pe'
  })
  .name;
