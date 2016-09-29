'use strict';
// @flow
class _User {
  _id: string = '';
  name: string = '';
  email: string = '';
  role: string = '';
  $promise = undefined;
}

export function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
  'ngInject';
  var safeCb = Util.safeCb;
  var currentUser: any = {};
  var userRoles = appConfig.userRoles || [];
  /**
   * Check if userRole is >= role
   * @param {String} userRole - role of current user
   * @param {String} role - role to check against
   */
  var hasRole = function(userRole, role) {
    return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
  };

  if($cookies.get('token') && $location.path() !== '/logout') {
    if($cookies.get('admi')){
      currentUser = $cookies.get('admi');
    }else{
      currentUser = $cookies.get('user');
    }
  }

  var Auth = {
    /**
     * Normal user login
     */
    loginUser(user){
      return $http.post('api/users/login', user)
        .then(res => {
          console.log('Finished!');
          
          if(!res.data.hasOwnProperty('error'))
            $cookies.put('user', JSON.stringify(res.data));
          // $cookies.put('isAdmi',true);
          // $cookies.put('token', res.data.token);
          // currentUser = res.data;
          return currentUser;
        })
        .then(user => {
          console.log('And then...');
          // safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          console.log('Now, this is an error');
          // safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },
    /**
     * Authenticate userAdmin and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    loginAdmin(user, callback: Function) {
      return $http.post('/auth/yunius/pe/login', user)
        .then(res => {
          console.log(res.data);
          $cookies.put('admi', res.data.datos);
          $cookies.put('isAdmi',true);
          $cookies.put('token', res.data.token);
          currentUser = res.data;
          return currentUser;
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    login({email, password}, callback: Function) {
      return $http.post('/auth/local', {
        email: email,
        password: password
      })
        .then(res => {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Delete access token and user info
     */
    logout() {
      $cookies.remove('user');
      $cookies.remove('admi');
      $cookies.remove('token');
      $cookies.remove('isAdmi');
      currentUser = {};
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    createUser(user, callback?: Function) {
      return User.save(user,
        function(data) {
          $cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        },
        function(err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
    },

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - function(error, user)
     * @return {Promise}
     */
    changePassword(oldPassword, newPassword, callback?: Function) {
      return User.changePassword({ id: currentUser._id }, { oldPassword, newPassword }, function() {
        return safeCb(callback)(null);
      }, function(err) {
        return safeCb(callback)(err);
      }).$promise;
    },

    /**
     * Gets all available info on a user
     *
     * @param  {Function} [callback] - function(user)
     * @return {Promise}
     */
    getCurrentUser(callback?: Function) {
      var value = currentUser.hasOwnProperty('$promise')
        ? currentUser.$promise
        : currentUser;

      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUserSync() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @param  {Function} [callback] - function(is)
     * @return {Promise}
     */
    isLoggedIn(callback?: Function) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
    },

    /**
     * Check if a user is logged in
     *
     * @return {Bool}
     */
    isLoggedInSync() {
      return currentUser.hasOwnProperty('role');
    },

     /**
      * Check if a user has a specified role or higher
      *
      * @param  {String}     role     - the role to check against
      * @param  {Function} [callback] - function(has)
      * @return {Promise}
      */
    hasRole(role, callback?: Function) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          var has = user.hasOwnProperty('role')
            ? hasRole(user.role, role)
            : false;

          safeCb(callback)(has);
          return has;
        });
    },

    /**
      * Check if a user has a specified role or higher
      *
      * @param  {String} role - the role to check against
      * @return {Bool}
      */
    hasRoleSync(role) {
      return hasRole(currentUser.role, role);
    },

     /**
      * Check if a user is an admin
      *   (synchronous|asynchronous)
      *
      * @param  {Function|*} callback - optional, function(is)
      * @return {Bool|Promise}
      */
    isAdmin() {
      return Auth.getQ();
    },

     /**
      * Check if a user is an admin
      *
      * @return {Bool}
      */
    isAdminSync() {
      return Auth.hasRoleSync('admin');
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $cookies.get('token');
    },

    /**
     * Get admi
     *
     * @return {String} - el administrador
     */
    getAdmi() {
      return $cookies.get('admi');
    },

    /**
     * Get user
     *
     * @return {String} - el usuario
     */
    getUser() {
      return JSON.parse($cookies.get('user'));
    },

    /**
     * Get user
     *
     * @return {String} - el usuario
     */
    getQ() {
      return $cookies.get('isAdmi');
    },

    /**
     * Check if a user is logged in
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Bool|Promise}
     */
    isLoggedAsAdmi() {
        return ($cookies.get('admi')?true:false) && (Auth.getToken()?true:false);
    },

    tieneAcceso(){
      if(Auth.getToken()!=undefined && Auth.getToken()!=null){
        return true;
      }
      return false;
    }
  };

  return Auth;
}
