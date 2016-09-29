'use strict'

const angular = require('angular');

import Base from '../../../components/object/base/Base';
/**
 * @class RecuperarController
 */
export default class RecuperarController extends Base{
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
  * Logs information 
  *
  * @method doRecuperar
  * @param {Object} ev Event that allows alerts to be shown
  */
  doRecuperar(ev){
  		console.log(this.recuperar);
  		this.showAlert(ev,{message:'Se reciben datos en doRecuperar(ev)'});
  		this.recuperar="";
  		console.log(this.recuperar);

      /*if(this.ready){
				this.ready = false;
				console.log(this.registro);
				this.Auth.loginAdmin(this.registro)
					.then(() =>{
						console.log(this.Auth.getUsuario());
						if(this.Auth.getUsuario()==undefined){
							this.ready = true;
							this.showAlert(ev,{message:'Combinación entre usuarios y contraseñas del registro es incorrecto'});
							this.registro.claveEm = "";
							this.registro.claveUs = "";
						}else{
							this.$location.path('/');
						}
					})
					.catch(err =>{
						this.showAlert(ev,err);
						this.ready = true;
						console.log('Error'+err);
					});
			}*/
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