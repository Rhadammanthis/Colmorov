'use strict';

import crypto from 'crypto';
import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

var CryptoJS = require("crypto-js");
const secretKey = 'werewolves666';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;
  var userName = req.body.userName;

  return User.findOne({ userName: userName }).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Get users log-in credentials
 */
export function login(req, res, next) {
  var userName = req.body.userName;
  var password = req.body.password;

  var encripter = new User(req.body);
  encripter.encryptPassword(password);

  var pass = req.body.password;

  console.log(pass);
  // console.log('Encripted pass');
  // console.log(encripter.encryptPassword(password));

  return User.findOne({ userName: userName }).exec()
    .then(user => {
      if(!user) {
        var error = {};
        error.message = "Invalid user credentials";
        return res.json(error);
      }

      // user.authenticate(password, function(authError, authenticated) {
      //   if (authError) {
      //     console.log('auth error');
      //     return res.send({message: 'Auth error'})
      //     // return done(authError);
      //   }
      //   if (!authenticated) {
      //     console.log('no success');
      //     return res.send('This password is not correct')
      //     // return done(null, false, { message: 'This password is not correct.' });
      //   } else {
      //     console.log('success!');
      //     return res.json(user.password);
      //     // return done(null, user);
      //   }
      // });
      var credentialBytes  = CryptoJS.AES.decrypt(pass, secretKey);
      var credential = credentialBytes.toString(CryptoJS.enc.Utf8);

      var serverBytes  = CryptoJS.AES.decrypt(user.password, secretKey);
      var server = serverBytes.toString(CryptoJS.enc.Utf8);

      if(credential === server)
      {
        console.log('equal');
        res.json(user);
      }
      else{
        console.log('not equal');
        var errorData = {};
        errorData.error = {};
        errorData.error.message = "Invalid credentials";
        console.log(errorData);
        res.json(errorData);
      }
      //correct response
      

    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
