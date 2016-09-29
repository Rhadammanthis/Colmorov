'use strict';

import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';
import request from 'request';
import url from '../components/utils/url';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
     // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
      if(req.query && typeof req.headers.authorization === 'undefined') {
        req.headers.authorization = 'Bearer ' + req.cookies.token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      console.log(req);
      if(!req.user){
            return res.status(401).end();
      }
      next();
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if(!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        return next();
      } else {
        return res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
  return jwt.sign({ _id: id, role }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signTokenU(user, token) {
  return jwt.sign({ data: user, token: token }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Returns a jwt token signed by the app secret for the CL
 */
export function signTokenC(user, token) {
  return jwt.sign({ cl: user, token: token }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if(!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}

/**
 * Envia el resultado con el token si se refresca en la consulta
 */
export function sendResult(req, res){
  if(req.user.token.actualizar){
    delete req.user.token.actualizar;
    if(req.user.hasOwnProperty('data')){
      res.token = signTokenU(req.user.data,req.user.token);
    }else if(req.user.hasOwnProperty('cl')){
      res.token = signTokenC(req.user.cl,req.user.token);
    }
  }
  return res;
}

/**
 * middleware para refrescar el token si no es valido
 */
export function refresh() {
    return function(req, res, next) {
        //var _SESSION = req.session;
        console.log("Estamos en el refresh");
        var options = { method: 'POST',
                        url: url('api'),
                        qs: { access_token: req.user.token.access_token },
                        headers: { 'cache-control': 'no-cache' } };
        //console.log(options);
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            try {
                body = JSON.parse(body);
                //Error cuando caduca el token{"error":"invalid_token","error_description":"Invalid access token: 0b9206cd-7a89-47c7-bc30-8a16f4e79daaA"}
                if(body.hasOwnProperty('error')){
                    //console.log('Tengo la propiedad');
                    console.log('El token es invalido '+req.user.token.access_token);
                    var optionsRf = { method: 'POST',
                                    url: url('oauth/token'),
                                    qs: { refresh_token: req.user.token.refresh_token},
                                    headers: { 'cache-control': 'no-cache' },
                                    form: { 
                                        client_id: 'YUNIUS_WEB',
                                        client_secret: '4yGuH7Wg456hrO2PtxfmqfMAFyukysCAKSqnMPq7p1jraH2OXxuVLYi93Uo6h9Gm',
                                        grant_type: 'refresh_token' } };
                    //console.log("OPCIONES RF",optionsRf);
                    try{
                      request(optionsRf, function (error, response, body) {
                          //console.log("ENTRE A REQUEST optionsRF body=", body,"ERROR=",error)
                          if (error) throw new Error(error);
                          body = JSON.parse(body);
                          console.log('----ENTRE A IF NUEVO TOKEN='+body.access_token);
                          if(body.hasOwnProperty('access_token')){
                              req.user.token = body;
                              req.user.token.actualizar = true;
                              console.log("TENGO ACCESS TOKEN REFRESH expires in",body.expires_in);
                              next();
                          }else{
                            delete req.user.token;
                            delete req.user.data;
                            delete req.user.cl;
                            next();
                          }
                      });
                    }catch(err){
                        console.log("error")
                        delete req.user.token;
                        delete req.user.data;
                        next();
                    }
                }else{
                  next();
                }

            }catch(err) {
                console.log('hola desde OAuth',err);
                next();
            }            
        });
    }
}
