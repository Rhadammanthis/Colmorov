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
  $cookies = null;
  $timeout = null;

  movie = {"info":[],"credits":[],"videos":[],"trailer_id":""};
  movieMetaData = {};

  youtubeEmbedUtils;
  id;
  ready: boolean = false;
  trailer;

  constructor($rootScope, $http, $location, $routeParams, $window, $cookies, $timeout, Auth, youtubeEmbedUtils) {
    super($rootScope);
    this.$http = $http;
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.$window = $window;
    this.$cookies = $cookies;
    this.$timeout = $timeout;

    this.youtubeEmbedUtils = youtubeEmbedUtils;
  }

  $onInit(){
    //scroll to top
    this.$window.scrollTo(0, 0);

    this.setToolbarMode(1);

    console.log(this.$window.navigator.language || this.$window.navigator.userLanguage);

    //retrieve movie meta data from cookies
    this.movieMetaData = JSON.parse(this.$cookies.get('mMeta'));
    console.log(this.movieMetaData);

    this.id = this.$routeParams.id;
    var _this = this;
    var url = this.getMovieInfoURL(this.id);

    this.$http.get(url, null).then(function (result) {
      _this.movie.info = result.data;
      _this.movie.credits = result.data.credits;
      _this.movie.videos = result.data.videos;

      _this.$window.document.title = result.data.original_title + ' — Colmorov';

      _this.processRawMovieData();
      _this.ready = true;

    }, function errorCallback(response) {

      console.log('Error');
      console.log(response);
      if(response.data.status_code == 25){
        _this.$timeout(function(){
          console.log('after 5 seconds');

          var url = _this.getMovieInfoURL(_this.id);
          _this.$http.get(url, null).then(function (result) {
            _this.movie.info = result.data;
            _this.movie.credits = result.data.credits;
            _this.movie.videos = result.data.videos;

            _this.$window.document.title = result.data.original_title + ' — Colmorov';

            _this.processRawMovieData();
            _this.ready = true;

          });
        }, 10000);
      }
    });   
  }

  processRawMovieData = function(){
    this.searchForDirector();
    this.sortTopBilledCast();
    this.searchMostPopularVideo();

    this.setTitle(this.movie.info.original_title);
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

  sortTopBilledCast = function(){
    var _this = this;
    this.movie.credits.manyTopBilledCast = [];
    this.movie.credits.fewTopBilledCast = [];
    for(var i = 0; i < 11; i++){
      _this.movie.credits.manyTopBilledCast.push(_this.movie.credits.cast[i]);
      if(i < 5){
        _this.movie.credits.fewTopBilledCast.push(_this.movie.credits.cast[i]);
      }
    }
  }

  searchMostPopularVideo = function(){
    
    console.log(this.movie.videos);
    if( this.movie.videos.results.length>1)
      this.movie.trailer_id = this.movie.videos.results[0].key;
    else
      this.movie.trailer_id = this.movie.videos.results[0].key;
    // var _this = this;
    //  console.log(this.movie.videos);
    // for(var i in _this.movie.videos.results){
    //   console.log(_this.movie.videos.results[i].key);
    //   console.log(_this.youtubeEmbedUtils.getTimeFromURL('https://www.youtube.com/watch?v='+_this.movie.videos.results[i].key));
    // }
  }

  getGenreResource = function(id){
    return '../../assets/images/genres/' + id + '.png';
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