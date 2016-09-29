'use strict'

const angular = require('angular');

import Base from '../../../components/object/base/Base';

class SignUpController extends Base{

    $http = null;
    $location = null;
    $mdDialog: any;
    $cookies: any;

    userData: any = {};
    signingUp: boolean = false;

    currentUser: any = {};

    passwordC: string;
    Auth: any;
    Crypto: any;

    constructor($rootScope, $http, $location, $mdDialog, Auth, $cookies, Crypto) {

        super($rootScope);

        this.$http = $http;
        this.$location = $location;
        this._$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.Auth = Auth;
        this.Crypto = Crypto;
        this.$cookies = $cookies;

        this.setTitle('Create a new account!');

    }

    $onInit()
    {
        if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
            console.log('A user seems to be logged')
            // var currentUser = this.Auth.getUser();

            // console.log(this.currentUser);
            // this._$rootScope.title = this.currentUser.userName;
        }

        console.log(this.Crypto.encrypt("Idspispopd9"));
        console.log(this.Crypto.decrypt('U2FsdGVkX1+9bAnRUplvjr1UDEo6gkLF30QRrRRZhCA='))

        this.setToolbarMode(1);
    }

    registerNewUser(ev){
        var _this = this;
        this.signingUp = true;
        console.log(this.userData);
        this.userData.password = this.Crypto.encrypt(this.userData.password);

        this.$http.post('api/users', this.userData).then(function (result) {
            _this.userData.password = _this.passwordC;
            console.log(result.data);
            _this.signingUp = false;
        });

    }

    equalPasswords(){
        if(!this.userData.password || !this.userData.passwordC)
            return false;

        if(this.userData.password === this.userData.passwordC)
            return true;
        else
            return false;
    }

}

export default angular.module('colmorovApp.signUp', [])
  .component('signup', {
    template: require('./signup.html'),
    // css: require('./signup.css'),
    controller: SignUpController,
    controllerAs: 'suc'
  })
  .name;