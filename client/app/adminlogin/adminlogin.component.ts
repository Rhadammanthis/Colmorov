'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './adminlogin.routes';
import Base from '../../components/object/base/Base';

/**
* Provides a controller that handles admin's log-in
*
* @class AdminloginComponent
* @constructor
*/
export class AdminloginComponent extends Base{
  $http: any;
	$location: any;
	$mdDialog: any;
	$mdMedia: any;
	login: any = {};
	ready: boolean = true;
	Auth: any;
	$rootScope: any;

  /*@ngInject*/
  constructor($rootScope, $http, $location, $mdDialog, $mdMedia, Auth) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
		this.Auth = Auth;
		this.$rootScope = $rootScope;
  }

  /**
  * Fired when the application is initiated. 
  * Checks user's credential and shows the appropriate view. 
  *
  * @event $onInit
  */
	$onInit(){
		if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
			this.$location.path('/');
		}else if(this.Auth.getAdmi()!==null&&this.Auth.getAdmi()!==undefined){
			this.$location.path('/');
		}
	}

  /**
  * Checks user's credentials and attempts to log-in using the Auth service. If successful, loads home page and if not shows alert. 
  *
  * @method doLogin
  * @param {Object} ev Event that allows alerts to be shown
  */
  doLogin(ev){
      if(this.ready){
				this.ready = false;
				this.Auth.loginAdmin(this.login)
					.then(() =>{
						console.log(this.Auth.getAdmi());
						if(this.Auth.getAdmi()==undefined){
							this.showAlert(ev,{message:'Combinación entre usuarios y contraseñas es incorrecto'});
							this.login.claveEm = "";
							this.login.claveUs = "";
						}else{
							this.$rootScope.menu = 'pe';
							this.$rootScope.show = 'on';
							this.$rootScope.title = 'Yunius';
							delete this.login;
							this.$location.path('/');
						}
						this.ready = true;
					})
					.catch(err =>{
						this.showAlert(ev,err);
						this.ready = true;
						console.log('Error'+err);
					});
			}
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
      console.log(response);
      var title = 'Error';
      var mensaje = 'Desconocido';
      if(response.hasOwnProperty('title')){
        title = response.title;
      }
      if(response.hasOwnProperty('message')){
        mensaje = response.message;
      }
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(title)
          .textContent(mensaje)
          .ariaLabel('Alert Dialog Demo')
          .ok('Aceptar')
          .targetEvent(ev)
      );
    }
}

export default angular.module('colmorovApp.adminlogin', [ngRoute])
  .config(routes)
  .component('adminlogin', {
    template: require('./adminlogin.html'),
    controller: AdminloginComponent,
    controllerAs: 'vm'
  })
  .name;
