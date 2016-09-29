'use strict';

export function MonitoreoService($location, $http, $cookies, $q, appConfig, Util, User) {
    'ngInject';
  var safeCb = Util.safeCb;
  var personalArray = {};

  var Personal = {

    /**
     * Authenticate userAdmin and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    getPersonal(siguiente, callback: Function) {
      console.log('Siguiente Servicio: ',siguiente);
      return $http.post('api/monitoreo/personal', {siguiente:siguiente}, {headers: {'Content-Type': 'application/json'} })
        .then(res => {
          $cookies.put('siguiente',res.data.siguiente);
          $cookies.put('total',res.data.total);
          personalArray = res.data.pearray;
          console.log('personalArray: ',personalArray);
          return personalArray;
        })
        .then(user => {
          safeCb(callback)(personalArray);
          return personalArray;
        })
        .catch(err => {
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    getSiguiente() {
      return $cookies.get('siguiente');
    },

    getTotal() {
      return $cookies.get('total');
    }

  };

  return Personal;
}
