'use strict'

const angular = require('angular');

import Base from '../../../components/object/base/Base';

class LogInController extends Base{

    $http = null;
    $location = null;
    $mdDialog: any;

    userData: any = {};
    logingIn: boolean = false;

    passwordC: string;

    Auth: any;
    Crypto: any;

    constructor($rootScope, $http, $location, $mdDialog, Auth, Crypto) {

        super($rootScope);

        this.$http = $http;
        this.$location = $location;
        this._$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.Auth = Auth;
        this.Crypto = Crypto;

        this.setTitle('Sign in!');

    }

    $onInit()
    {
        console.log('init')
        this.setToolbarMode(1);
    }

    logUserIn(event){
        var credentials = {};
        credentials.userName = this.userData.userName;
        credentials.password = this.Crypto.encrypt(this.userData.password);

        this.Auth.loginUser(credentials)
					.then(() =>{
						console.log(this.Auth.getAdmi());
						if(this.Auth.getUser()==undefined){
                            console.log('an error...')
							 this.showAlert(event,{message:'User name and password do not match!'});
							// this.login.claveEm = "";
							// this.login.claveUs = "";
						}else{
                            console.log('no error...')
							this.showAlert(event,{message:'You are now logged in!'});
							// this.$rootScope.show = 'on';
							// this.$rootScope.title = 'Yunius';
							// delete this.login;
							// this.$location.path('/');
						}
                        console.log('should be ready');
						// this.ready = true;
                        // this.userData.password = this.Crypto.decrypt(this.userData.password);
					})
					.catch(err =>{
						 this.showAlert(event,err);
						// this.ready = true;
						console.log('Error'+err);
					});
    }

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

export default angular.module('colmorovApp.logIn', [])
  .component('login', {
    template: require('./login.html'),
    // css: require('./signup.css'),
    controller: LogInController,
    controllerAs: 'lic'
  })
  .name;