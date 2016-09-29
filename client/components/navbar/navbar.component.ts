'use strict';
/* eslint no-sync: 0 */
const angular = require('angular');

import Base from '../object/base/Base';
import {ModeToolbar} from '../object/base/Base';
/**
 * @class Definicion del toolbar
 */
export class NavbarComponent extends Base{
  $mdSidenav: any;
  toggleLeft: Function;
  //TODO change this when new admin aclaraciones views are created
  aclaracionesURL: String = 'administracion/aclaraciones/chat?cdgacl=20&tipo=A&fregistro=1470614400000&estado=A';
  $log: any;
  Auth: any;
  $rootScope: any;
  $location: any;
  isCollapsed: boolean = true;

  /**
   * @constructor Inicializa todas las variables
   */
  constructor($rootScope, $mdSidenav, $log, $location, Auth) {
    'ngInject';
    super($rootScope);
    this.$mdSidenav = $mdSidenav;
    this.$location = $location;
    this.toggleLeft = this.buildToggler('left');
    this.$log = $log;
    this.Auth = Auth;
  }

  /**
  * Fired when the application is initiated. 
  * Checks user's credential and shows the appropriate view. 
  *
  * @event $onInit
  */
	$onInit(){
    this.setTitle('Colmorov');
		if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined){
			this.setMenuCl();
		}else if(this.Auth.getAdmi()!==null&&this.Auth.getAdmi()!==undefined){
			this.setMenuPe();
		}else{
      this.setModeToolbar(ModeToolbar.OFF);
      console.log(ModeToolbar.OFF);
    }
	}

  /**
   * @function Para abrir el menú lateral
   */
  isOpenLeft(){
      return this.$mdSidenav('left').isOpen();
  };

  buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        var _this = this;
        this.$mdSidenav(navID)
          .toggle()
          .then(function () {
            _this.$log.debug("toggle " + navID + " is done");
          });
      }
    };

  isActive(route) {
    return route === this.$location.path();
  }

  logOut(){
    // this.$mdSidenav('left').close();
    this.Auth.logout();
    this.setToolbarMode(0);
    this.$location.path('/');
  }

  inicio(){
    this.$mdSidenav('left').close();
    this.$location.path('/signup');
    this.setTitle('Yunius');
  }

  goToSignUp(){
    this.$location.path('/signup');
  }

  goToLogIn(){
    this.$location.path('/login');
  }

  goBack(){
    this.$location.path('/');
  }


  aclaracionescl(){
    this.$mdSidenav('left').close();
    this.$location.path('/aclaraciones');
    this.setTitle('Aclaraciones');

    this.setModeToolbar(ModeToolbar.NORMAL);
    this.$rootScope.showTerminar = '';
    this.$rootScope.refresh = '';
  }

  personal(){
    this.$mdSidenav('left').close();
    this.$location.path('/monitoreo/personal');
    this.setTitle('Personal');
    this.setModeToolbar(ModeToolbar.NORMAL);
  }

    aclaracionespe(){
    this.$mdSidenav('left').close();
    this.$location.path('/aclaraciones/pe');
    this.setTitle('Aclaraciones');
    this.setModeToolbar(ModeToolbar.NORMAL);
  }

  doEstadoDeCuenta(){
    this.$mdSidenav('left').close();
    this.$location.path('/estadodecuenta');
    this.setTitle('Estado de cuenta');
    this.setModeToolbar(ModeToolbar.NORMAL);
  }

  goMap(){
    this.$mdSidenav('left').close();
    // this.$rootScope.mapSend();
    this.$location.path('/monitoreo/mapa');
    this.setTitle('Ruta');
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent,
    controllerAs: 'nav'
  })
  .name;
