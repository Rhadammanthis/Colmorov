'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './profile.route';
import Base from '../../components/object/base/Base';

export class ProfileComponent extends Base{
  message: string;
  showTable: boolean = false;
  movies = [];

  $http = null;
  $location = null;

  Auth: any;

  constructor($rootScope, $http, $location, Auth) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.message = 'Hello';
    this.Auth = Auth;
    this.movies = [];
    
  }

  $onInit()
  {
    console.log('onInit');
    var _this = this;
    var parsedResponse = {};

    this.setToolbarMode(2);

    if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
      var currentUser = this.Auth.getUser();
      this._$rootScope.title = 'Hi there, ' + currentUser.userName + '!';
    }
    else{
      this.$location.path('/');
    }

    this.$http.get('api/movies', null).then(function (result) {
      console.log('from get');
      parsedResponse.id = [];

      for(var i = 0; i < result.data.length; i++) {
        var obj = result.data[i];

        parsedResponse.id.push(obj.mdb_id);
      }

      console.log(parsedResponse);

      _this.$http.post('api/movies', parsedResponse).then(function (result) {
      console.log(result.data);
      _this.movies = result.data;
     });  
      
    });  

  }

  completeImagePath = function(path: string){
    if(path != null)
      return "https://image.tmdb.org/t/p/w600/" + path;
    else
      return "http://www.tea-tron.com/antorodriguez/blog/wp-content/uploads/2016/04/lowRes1.jpeg";
  }

  loadSingle = function(movie){
    console.log('doing shit...');
    this.$location.url('/movies/' + movie.id);
  }

  like = function(){
    console.log('liking');
  }
}

export default angular.module('colmorovApp.profile', [ngRoute, 'angular-loading-bar'])
  .config(routes)
  .component('profile', {
    template: require('./profile.html'),
    css: require('./profile.css'),
    controller: ProfileComponent,
    controllerAs: 'pfc'
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .name;