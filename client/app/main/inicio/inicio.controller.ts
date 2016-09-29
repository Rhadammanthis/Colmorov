'use strict'

const angular = require('angular');

import Base from '../../../components/object/base/Base';
import {ModeToolbar} from '../../../components/object/base/Base';
/**
 * @class Maincontroller
 */
class InicioController extends Base{

  message: string;
  showTable: boolean = false;
  movies = [];

  $http = null;
  $location = null;
  // cfpLoadingBar = null;

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

    // var data = JSON.stringify({
    //   "id": [
    //     313922,
    //     310131,
    //     290250,
    //     209112,
    //     // 301365
    //   ]
    // });

    // console.log(this.movies);
    // console.log(data);

    // this.$http.post('api/movies', data).then(function (result) {
    //   console.log(result.data);
    //   _this.movies = result.data;
    // });  

  }

  completeImagePath = function(path: string){
    if(path != null)
      return "https://image.tmdb.org/t/p/w600/" + path;
    else
      return "http://www.tea-tron.com/antorodriguez/blog/wp-content/uploads/2016/04/lowRes1.jpeg";
  }

  swatch = function(path: string)
  {
    var hex;

    var img = document.createElement('img');
    img.setAttribute('crossOrigin', 'anonymous');
    img.setAttribute('src', path)

    img.addEventListener('load', function() {

      var vibrant = new Vibrant(img);
      var swatches = vibrant.swatches()
      for (var swatch in swatches)
        if (swatches.hasOwnProperty(swatch) && swatches[swatch])
          console.log(swatch, swatches[swatch].getHex())
      hex = swatches[0].getHex();
    });

    return hex;
  }

  loadSingle = function(movie){
    console.log('doing shit...');
    this.$location.url('/movies/' + movie.id);
  }

  like = function(){
    console.log('liking');
  }

}

export default angular.module('colmorovApp.inicio', ['angular-loading-bar'])
  .component('inicio', {
    template: require('./inicio.html'),
    controller: InicioController,
    controllerAs: 'moviesCtrl'
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .name;

// class InicioControllr extends Base{
//   $http: any;
// 	$location: any;
// 	$mdDialog: any;
// 	$mdMedia: any;
// 	login: any = {};
// 	registro: any = {};
// 	correo: any = {};
// 	recuperar: any = {};
// 	ready:boolean = true;
// 	Auth: any;

//   /**
//    * @constructor El constructor
//    */
//   /*@ngInject*/
//   constructor($rootScope, $http, $location, $mdDialog, $mdMedia, Auth) {
//     super($rootScope);
//     this.$http = $http;
//     this.$location = $location;
//     this.$mdDialog = $mdDialog;
//     this.$mdMedia = $mdMedia;
// 	  this.Auth = Auth;
//   }

//   /**
//   * Fired when the application is initiated. 
//   * Checks user's credential and shows the appropriate view. 
//   *
//   * @event $onInit
//   */
// 	$onInit(){
// 		if(this.$location.path()!=='/'){
// 			if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
// 				this.$location.path('/');
// 			}else if(this.Auth.getAdmi()!==null&&this.Auth.getAdmi()!==undefined){
// 				this.$location.path('/');
// 			}
// 		}
// 	}

//   /**
//   * Checks user's credentials and attempts to log-in using the Auth service. If successful, loads home page and if not shows alert. 
//   *
//   * @method doLogin
//   * @param {Object} ev Event that allows alerts to be shown
//   */
//   doLogin(ev){
//       if(this.ready){
// 				this.ready = false;
// 				this.Auth.login(this.login)
// 					.then(() =>{
// 						if(this.Auth.getUser()==undefined){
// 							this.showAlert(ev,{message:'Combinación entre usuarios y contraseñas del login es incorrecto'});
// 							this.login.usuario = "";
// 							this.login.contrasena = "";
// 						}else{
//               this.setMenuCl();
//               this.setModeToolbar(ModeToolbar.NORMAL);
//               this.setTitle('Yunius');
// 							delete this.login;
// 						}
// 						this.ready = true;
// 					})
// 					.catch(err =>{
// 						this.showAlert(ev,err);
// 						this.ready = true;
// 						console.log('Error'+err);
// 					});
// 			}
//     }

//     /**
//     * Shows an alert with a message 
//     *
//     * @method showAlert
//     * @param {Object} ev Event that allows alerts to be shown
//     * @param {Object} response JSON object with the message to be shown
//     */
//     showAlert(ev,response) {
//         // Appending dialog to document.body to cover sidenav in docs app
//         // Modal dialogs should fully cover application
//         // to prevent interaction outside of dialog
//         this.$mdDialog.show(
//           this.$mdDialog.alert()
//             .parent(angular.element(document.querySelector('#popupContainer')))
//             .clickOutsideToClose(true)
//             .title(response.title)
//             .textContent(response.message)
//             .ariaLabel('Alert Dialog Demo')
//             .ok('Aceptar')
//             .targetEvent(ev)
//         );
//     }
// }