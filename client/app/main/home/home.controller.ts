'use strict'

const angular = require('angular');

import Base from '../../../components/object/base/Base';

class HomeController extends Base{

    $http = null;
    $location = null;

    Auth: any;

    constructor($rootScope, $http, $location, Auth) {

        super($rootScope);

        this.$http = $http;
        this.$location = $location;
        this._$rootScope = $rootScope;
        this.Auth = Auth;

        this.setTitle('Colmorov - Fam M&M');

    }

    $onInit()
    {
        console.log('init')
        if(this.Auth.getUser()!==null&&this.Auth.getUser()!==undefined)
        {
            this.setToolbarMode(3);
            var currentUser = this.Auth.getUser();
            this.setTitle('Welcome, ' + currentUser.userName + '!');
        }
        else
            this.setToolbarMode(0);
    }

}

export default angular.module('colmorovApp.home', [])
  .component('home', {
    template: require('./home.html'),
    css: require('./home.css'),
    controller: HomeController,
    controllerAs: 'hc'
  })
  .name;