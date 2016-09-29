'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './list.routes';
import Base from '../../components/object/base/Base';

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

    $onInit(){
        this.setToolbarMode(2);
    
		// if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
		// 	this.$location.path('/');
		// }else if(this.Auth.getAdmi()!==null&&this.Auth.getAdmi()!==undefined){
		// 	this.$location.path('/');
		// }
	}
}

export default angular.module('colmorovApp.adminlogin', [ngRoute])
  .config(routes)
  .component('list', {
    template: require('./list.html'),
    controller: AdminloginComponent,
    controllerAs: 'ltc'
  })
  .name;