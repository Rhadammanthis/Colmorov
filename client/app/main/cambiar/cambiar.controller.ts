'use strict'

const angular = require('angular');

import Base from '../../../components/object/base/Base';
/**
 * @class Cambiarcontroller
 */
export default class CambiarController extends Base{
  $http: any;
	$location: any;
	$mdDialog: any;
	$mdMedia: any;
	login: any = {};
	registro: any = {};
	correo: any = {};
	recuperar: any = {};
	ready:boolean = true;
	Auth: any;

  /**
   * @constructor El constructor
   */
  /*@ngInject*/
  constructor($rootScope, $http, $location, $mdDialog, $mdMedia, Auth) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
	  this.Auth = Auth;
  }

  /**
  * Fired when the application is initiated. 
  * Checks user's credential and shows the appropriate view. 
  *
  * @event $onInit
  */
	$onInit(){
		if(this.$location.path()!=='/'){
			if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
				this.$location.path('/');
			}else if(this.Auth.getAdmi()!==null&&this.Auth.getAdmi()!==undefined){
				this.$location.path('/');
			}
		}
	}

  /**
  * Prompts an alert that informs the user about a received email 
  *
  * @method doCorreo
  * @param {Object} ev Event that allows alerts to be shown
  */
  doCorreo(ev){
  		console.log(this.correo);
  		this.showAlert(ev,{message:'Se recibe el correo proporcionado en doCorreo(ev) para buscarlo en la BD y si se encuentra, mandar una clave.'});
  		this.correo="";
  		console.log(this.correo);
   }

    /**
    * Shows an alert with a message 
    *
    * @method showAlert
    * @param {Object} ev Event that allows alerts to be shown
    * @param {Object} response JSON object with the message to be shown
    */
    showAlert(ev,response) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        this.$mdDialog.show(
          this.$mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(response.title)
            .textContent(response.message)
            .ariaLabel('Alert Dialog Demo')
            .ok('Aceptar')
            .targetEvent(ev)
        );
    }
}