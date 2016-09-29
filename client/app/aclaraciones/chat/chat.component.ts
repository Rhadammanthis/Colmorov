'use strict';
const angular = require('angular');

import CookiesBase from '../../../components/object/base/CookiesBase';

/**
* Provides a controller that loads chat messages and allows new messages to be sent
*
* @class AclaracionesChatComponent
* @constructor
*/
class AclaracionesChatComponent extends CookiesBase {

      /**
      * Angular service to perform http requests 
      *
      * @property $http
      * @type any
      */
      $http: any;

      /**
      * Angular service to parse the URL in the browser address bar 
      *
      * @property $location
      * @type any
      */
      $location: any;

      /**
      * Service that validates the user's auth information 
      *
      * @property Auth
      * @type boolean
      */
      Auth: any;
      $scope: any;
      $rootScope: any;

    constructor($rootScope, $http, $scope, $location, $cookies, Auth) {
      super($rootScope,$cookies)
      this.$http = $http;
      this.$location = $location;

      this.Auth = Auth;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      $rootScope.show = 'chat';
      $rootScope.showPath = '/aclaraciones';
      //function when TERMINAR button press
      $rootScope.doTerminar = this.doTerminar.bind(this);
      $rootScope.refresh = 'show';
      $rootScope.doRefresh = this.getMensajes.bind(this);
      $scope.comment = '';
      //set user type to client
      $scope.userType = 'C';

      this.extractParams($scope, $location);
      $scope.loading = true;
      this.getMensajes();
    }

    /**
     * Set the cdgacl tipo and estado color depending o the search from the location
     * @param $scope
     * @param $location
     */
    private extractParams($scope, $location) {

      var stringy = this.getDataTemp();
      var aclaracion = JSON.parse(stringy);

      $scope.cdgacl = parseInt(aclaracion.cdgacl);
      var tipo = aclaracion.tipo == 'C' ? 'Comentario' :  'Aclaracion';
      var date = new Date(parseInt(aclaracion.fregistro));
      tipo += ' - ' + date.toDateString();
      this.$rootScope.title = tipo;
      $scope.fregistro = parseInt(aclaracion.fregistro);
      $scope.estado = aclaracion.estado;

      if ($scope.estado == 'A') {
        this.$rootScope.showTerminar = 'show';
        $scope.estadoColor = {'color': '#4CAF50'};
      } else if ($scope.estado == 'C') {
        this.$rootScope.showTerminar = null;
        $scope.estadoColor = {'color': '#F44336'};
      } else if ($scope.estado == 'E') {
        this.$rootScope.showTerminar = 'show';
        $scope.estadoColor = {'color': '#FBC02D'};
      }
    }

    /**
     * Post to WS the new text for the message and update the message
     * @param mensaje the message to try to update
     */
    editMensaje(mensaje){
      //if no change were made in the text dont post to WS
      if(mensaje.texto == mensaje._texto){
        this.toogleEditMensaje(mensaje);
        return
      }
      var input = {id: mensaje.id, texto: mensaje._texto};
      //show loading spinner
      this.$scope.loading = true;
      this.$http.post('api/aclaraciones/mensaje/editar', input)
        .then(function (result) {
          this.$scope.loading = false;
          //update the current message with the edit text
          mensaje.texto = mensaje._texto;
          this.toogleEditMensaje(mensaje)
        }.bind(this)
        ,function (result) {
            this.$scope.loading = false;
            alert('Error');
            this.toogleEditMensaje(mensaje);
            console.log(result);
          }.bind(this));
    }

    /**
     * will use _text field for handling the new text of the message
     * if no change were made will reset the _text to the initial
     * and will change the current editing field to the contrary
     * @param mensaje
     */
    toogleEditMensaje(mensaje){
      mensaje._texto = mensaje.texto;
      if(mensaje.editing != null){
        mensaje.editing = !mensaje.editing;
      }
      else{
        mensaje.editing = true;
      }
    }


    /**
     * return true if the mensaje is the las one and the aclaracion is not finished and is from the current user
     * @param mensaje the current mesaje
     * @param index position of the mensaje
     * @returns {boolean} true if this message can be edited
     */
    canEditMessage(mensaje, index){
      return index == this.$scope.mensajes.length - 1  && !mensaje.editing && this.$scope.estado != 'C' && mensaje.registra == 'C';
    }

    /**
     *  Request to the WS for the messages for this aclarations
     * @param cdgacl the aclaration code
     * @param $scope the scope for loading the messages in $scope.mesajes
     */
     getMensajes() {
      var id = {id: {cdgacl: this.$scope.cdgacl }};
      console.log(id);
      var header =  {'content-type': 'application/json' };
      this.$scope.loading = true;
      this.$scope.mensajes = [];
      this.$http.post('api/aclaraciones/mensaje', id, header)
        .success(function (data, status, headers, config) {
          this.$scope.loading = false;
          if(data.daclarray != null){
            this.$scope.mensajes = data.daclarray;
          }else{
            this.$scope.mensajes = [];
          }
        }.bind(this))
        .error(function (data, status, header, config) {
          this.$scope.loading = false;
          console.log(data);
          this.$scope.mensajes = [];
        }.bind(this));
    }

    /**
     * Clean the params before leaving to another page
     * and remove from $rootview showTerminar that will return to /aclaraciones check navbar for more info
     */
    $onDestroy() {
      this.$location.search({});
      this.$rootScope = 1;
      //return to client navbarview
      //remove the terminar button
      this.$rootScope.showTerminar = '';
      this.$rootScope.refresh = null;
    }

    $onInit() {
      if(!this.Auth.tieneAcceso()){
        this.$location.path('/');
        this.$location.search({});
      }
    }

    /**
     * Post to make the aclaration with status close
     */
    doTerminar(){
      var input = {id: {cdgacl: this.$scope.cdgacl}};
      this.$scope.loading = true;
      this.$http.post('api/aclaraciones/terminar/set', input)
        .then(function (result) {
          this.$scope.loading = false;

          var stringy = this.getDataTemp();
          var search = JSON.parse(stringy);

          search.estado = 'C';
          this.$location.search(search);
          this.$scope.estado = "C";
          this.$scope.estadoColor = {'color': '#F44336'};
          this.$rootScope.showTerminar = '';
        }.bind(this),
        function (result) {
          console.log(result);
          console.log('error');
        })
    }

    /**
     * Function for posting a new mesaje to this aclaration
     * get comment from $scope.comment and cdgacl from $scope.cdgacl
     */
    doMessage(){
      this.$scope.loading = true;
      var mensaje;
      mensaje = {id: {cdgacl: this.$scope.cdgacl}};
      mensaje.texto = this.$scope.comment;
      mensaje.texto_editable = 'S';
      mensaje.registra = 'C';
      mensaje.fecha = new Date().getTime();
      this.$http.post('api/aclaraciones/mensaje/agregar', mensaje)
        .then(
          function (data) {
            this.$scope.loading = false;
            if(data.data.hasOwnProperty('error')){
              console.log('Error');
              console.log(data.data);
              return;
            }
            this.$scope.mensajes.push(mensaje);
            console.log(data.data);
          }.bind(this)
          ,function () {
            this.$scope.loading = false;
            alert('error');
        }.bind(this));
      this.$scope.comment = '';
    }

    /**
     * Return to the aclaraciones pag
     */
    goAclaraciones(){
      //return to client navbarview
      this.$rootScope.show = 1;
      //remove the terminar button
      this.$rootScope.showTerminar = null;
      this.$location.path('/aclaraciones/pe');
    }

  }


  export default angular.module('colmorovApp.aclaraciones.chat', [])
    .component('chat', {
      template: require('./chat.html'),
      controller: AclaracionesChatComponent,
      controllerAs: 'acla'
    })
    .name;
