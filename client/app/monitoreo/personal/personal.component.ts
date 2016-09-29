'use strict';
const angular = require('angular');

import TablaBase from '../../../components/object/base/TablaBase';

/**
* Personal que tiene registrados monitoreos.
*
* @class PersonalComponent
* @constructor
*/
class PersonalComponent extends TablaBase{ 

    /**
     * Constructor con parametros
     * @param $rootScope
     * @param $scope
     * @param $cookies
     * @param $http
     */
    /*@ngInject*/
    constructor($rootScope, $scope, $cookies, $http) {
      super($rootScope,$scope,$cookies,'api/monitoreo/personal',{},$http,'pearray');
      this._order = 'nombre';
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
}

export default angular.module('yuniusApp.monitoreo.personal',[])
  .component('personal', {
    template: require('./personal.html'),
    controller: PersonalComponent,
    controllerAs: 'pe'
  })
  .name;