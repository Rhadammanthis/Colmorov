'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './list.routes';
import Base from '../../components/object/base/Base';

export class ListComponent extends Base{
  $http: any;
	$location: any;
	$mdDialog: any;
	$mdMedia: any;
	login: any = {};
	ready: boolean = true;
	Auth: any;
	$rootScope: any;

  screenHeight;
  screenWidth;

  pics;
  message = "Hola";

  users = ['Fabio', 'Leonardo', 'Thomas', 'Gabriele', 'Fabrizio', 'John', 'Luis', 'Kate', 'Max'];

  angularGridInstance

  /*@ngInject*/
  constructor($rootScope, $http, $location, $mdDialog, $mdMedia, Auth, angularGridInstance) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
	  this.Auth = Auth;
    this.angularGridInstance = angularGridInstance;
	  this.$rootScope = $rootScope;
  }

  loadImages = function(){
      return this.$http.get("api/list");
  };

  refresh = function(){
      this.angularGridInstance.gallery.refresh();
  }

  $onInit(){
      this.setToolbarMode(2);
      var _this = this;

      this.calculatePosterSize();

      this.loadImages().then(function(data){
          
        //   data.data.items.forEach(function(obj){
        //       var desc = obj.description,
        //           width = desc.match(/width="(.*?)"/)[1],
        //           height = desc.match(/height="(.*?)"/)[1];

        //       obj.actualHeight  = height;
        //       obj.actualWidth = width;
        //   });
          _this.pics = data.data.movies;
          console.log('should be ready');
          console.log(_this.pics);
          _this.refresh();
          console.log(_this.pics);
          _this.message = "Friend";
      });

    }

    calculatePosterSize = function(){
      
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;

      this.screenWidth /= 5;

      this.screenHeight = (2/3) * this.screenWidth;

      console.log('Height: ' + this.screenHeight);
      console.log('width: ' + this.screenWidth);

    }
}


export default angular.module('colmorovApp.adminlogin', [ngRoute])
  .config(routes)
  .component('list', {
    template: require('./list.html'),
    css: require('./list.css'),
    controller: ListComponent,
    controllerAs: 'ltc'
  })
  .name;