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
  $cookies: any;
	login: any = {};
	ready: boolean = true;
	Auth: any;
	$rootScope: any;

  screenHeight;
  screenWidth;

  pics;
  listTotal;

  message = "Hola";

  users = ['Fabio', 'Leonardo', 'Thomas', 'Gabriele', 'Fabrizio', 'John', 'Luis', 'Kate', 'Max'];

  customFullscreen: boolean = false;

  angularGridInstance: any;

  status;
  busy = false;

  /*@ngInject*/
  constructor($rootScope, $http, $location, $mdDialog, $mdMedia, $cookies, Auth, angularGridInstance) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$cookies = $cookies;
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
      this.setTitle("Colmorov — Colection");
      var _this = this;

      this.loadImages().then(function(data){
  
          _this.pics = data.data.movies;
          _this.listTotal = data.data.total;
          console.log('should be ready');
          console.log(_this.pics);
          _this.refresh();
          console.log(_this.pics);
          _this.message = "Friend";

      });

  }

  addNewMovieDialog = function(ev){
      var _this = this;
      this.$mdDialog.show({
        locals:{listTotal: _this.listTotal},
        controller: DialogController,
        controllerAs: 'anc',
        template: require('./addNew.tmpl.html'), 
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: _this.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        _this.loadImages().then(function(data){
  
          _this.pics = data.data.movies;
          _this.listTotal = data.data.total;
          console.log('should be ready');
          console.log(_this.pics);
          _this.refresh();
          console.log(_this.pics);
          _this.message = "Friend";

      });
      }, function() {
        _this.status = 'You cancelled the dialog.';
      });
  }

  loadMovieInfo = function(movie){

    //save movie meta data as a cookie
    var movieMetaData = {"list_id":0, "status":""};
    movieMetaData.list_id = movie.list_id;
    movieMetaData.status = "In collection";
    this.$cookies.put('mMeta',JSON.stringify(movieMetaData));

    this.$location.path('/movie/'+movie.mdb_id);
  }

}

  class DialogController{

    $scope;
    $mdDialog;
    $http;

    busy: boolean = false;
    page = 1;

    movies = [];
    listTotal;

    movieTitle;

    newMovie = {};
    disableAddNew = true;

    /*@ngInject*/
    constructor($scope, $mdDialog, $http, listTotal){
      this.$scope = $scope;
      this.$mdDialog = $mdDialog;
      this.$http = $http;
      this.listTotal = listTotal;
    }
    
    hide = function() {
      this.$mdDialog.hide();
    };

    cancel = function() {
      this.$mdDialog.cancel();
    };

    confirAddNew = function(answer) {
      
      var _this = this;
      this.$http.post('api/list/add', this.newMovie).then(function (result) {
            _this.$mdDialog.hide("Movie added!");
        });

      // this.$mdDialog.hide(answer);
    };

    $onInit(){
      console.log('init');
      this.fetchItems(ngRoute.movieTitle);
    }

    fetchItems = function(query){
      console.log('Fetch called with busy='+this.busy);
      if (this.busy) return;
      if(!query) return;

      query = query.replace(" ", "+");
      
      this.busy = true;
      var _this = this;
      
      var url = "http://api.themoviedb.org/3/search/movie?query="+ query +"&page="+ this.page +"&api_key=531aec356bbd54359474847e57c79986";
      console.log(url);
      this.$http.get(url).then(function(data){
        console.log(data.data);

        var items = data.data.results;
        for (var i = 0; i < items.length; i++) {
          _this.movies.push(items[i]);
        }

        console.log('Items: ' + _this.movies.length);
        _this.page++;

        _this.busy = (_this.movies.length == data.data.total_results);
        
      });
    }

    searchTitle = function(){
      console.log(this.movieTitle);
      this.busy = false;
      this.page = 1;
      this.movies = [];

      this.fetchItems(this.movieTitle);
    }

    select = function(movie){

      var listId = this.listTotal + 1;
      this.newMovie.list_id = listId;
      this.newMovie.mdb_id = movie.id;

      this.disableAddNew = false;
      console.log(this.newMovie);
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