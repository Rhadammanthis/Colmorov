'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './movie.route';
import Base from '../../components/object/base/Base';

export class MovieInfoComponent extends Base{

  $http = null;
  $location = null;
  $routeParams = null;
  $window = null;

  id;
  movie = {"info":[],"credits":[]};

  constructor($rootScope, $http, $location, $routeParams, $window, Auth) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.$window = $window;
  }

  $onInit(){
    this.setToolbarMode(2);
    console.log('onInit');
    this.id = this.$routeParams.id;

    var _this = this;
    var url = this.getMovieInfoURL(this.id);

    this.$http.get(url, null).then(function (result) {
      _this.movie.info = result.data;
      _this.$window.document.title = result.data.original_title + ' — Colmorov';
      url = _this.getMovieCreditsURL(_this.id);
      
      _this.$http.get(url, null).then(function (result) {
        _this.movie.credits = result.data;
        _this.searchForDirector();
      });

    });   
  }

  searchForDirector = function(){
    var _this = this;
    if(this.movie.credits){
      for(var i in _this.movie.credits.crew){
        if(_this.movie.credits.crew[i].department == "Directing")
          if(_this.movie.credits.crew[i].job == "Director")
            _this.movie.info.director = _this.movie.credits.crew[i].name;
      }
    }
  }

}

export default angular.module('colmorovApp.movieInfo', [ngRoute])
  .config(routes)
  .component('movieInfo', {
    template: require('./movie.html'),
    css: require('./movie.css'),
    controller: MovieInfoComponent,
    controllerAs: 'mic'
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .name;