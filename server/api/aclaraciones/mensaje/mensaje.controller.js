/**
 * Using Rails-like standard naming convention for endpoints.
 * POST   /api/aclaraciones/mensaje             ->  getAll
 * POST   /api/aclaraciones/mensaje/editar      ->  edit
 * POST   /api/aclaraciones/mensaje/agregar     ->  create
 */
'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInput(body,user) {
 var input = {};
    input.id = {};
    if(user.hasOwnProperty('cl')){
      input.id.cdgem = user.cl.id.cdgem;
    }else{
      input.id.cdgem = user.data.empresa.codigo;
    }
    input.id.cdgacl = body.id.cdgacl;
    return input;
}


export function getAll(req, res){
    var bodys = parseInput(req.body, req.user);
    var options = { method: 'POST',
        url: url('api/aclaraciones/mensajes/get?access_token=' + req.user.token.access_token),
        headers:
            {'cache-control': 'no-cache',
            'accept-language': 'application/json',
            'content-type': 'application/json' },
        body: bodys,
        json: true
    };
    request(options, function (error, response, body)
    {
        if (error) throw new Error(error);

        if(body.hasOwnProperty('error')){
          console.log(body.error_description);
          res.json(body);
        }else{
            for(var i in body.daclarray){
                delete body.daclarray[i].id.cdgem;
            }
            /**
             * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
             */
            res.json(sendResult(req,body));
        }
    });
}

/**
* Creates the necessary input for the WS from the body and the user info
 */
function createBodyMensaje(body, user) {
  var id = {}, registra;
  if(user.hasOwnProperty('cl')){
    registra = 'C';
    id = {cdgacl: body.id.cdgacl, cdgem: user.cl.id.cdgem};
  }else{
    console.log(user.data.usuario);
    registra = 'P';
    id = {cdgacl: body.id.cdgacl, cdgem: user.data.empresa.codigo,cdgpe: user.data.usuario.codigo};
  }
  var input = {id: id,
    texto: body.texto,
    texto_editable: body.texto_editable,
    registra: registra,
    fecha: Date.now()};
    console.log(input);
    return input;
}

export function create(req, res) {
  var bodys = createBodyMensaje(req.body, req.user);
  var options = { method: 'POST',
    url: url('api/aclaraciones/mensaje/set?access_token=' + req.user.token.access_token),
    headers:
    {'cache-control': 'no-cache',
      'accept-language': 'application/json',
      'content-type': 'application/json' },
    body: bodys,
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.hasOwnProperty('error')) {
      console.log(body.error);
      res.json(sendResult(req, body));
    }
    else if(isEmptyObject(body)){
      res.json(sendResult(req, {error: "Input invalido"}));
    }else{
      res.json(sendResult(req, body));
    }
  });
}

/**
* Will generate the inputAclaracionMesaje needed for the WS
* @param body should contain  {texto, id: {cdgem, cdgdac}}
* @param client with {cl: {id: {cdgem, codigo}}}
* @returns {{tipo fregistro estado id cdgem cdgpar}}
**/
function createBodyAclaracion(body, user) {
  var aclaracion  = {id: {}};
  aclaracion.texto = body.texto;
  if(user.hasOwnProperty('cl')){
    aclaracion.id.cdgem = user.cl.id.cdgem;
  }else{
    aclaracion.id.cdgem = user.data.empresa.codigo;
  }
  aclaracion.id.cdgacl = body.id.cdgacl;
  aclaracion.id.cdgdac = body.id.cdgdac;
  return aclaracion;
}

/**
 * return true if the object has properties or false if the object is empty
 * @param obj the object to test
 * @returns {boolean}
 */
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}


export function edit(req, res) {
  var bodys = createBodyAclaracion(req.body,req.user);
  var options = { method: 'POST',
    url: url('api/aclaraciones/edit/mensaje/set?access_token=' + req.user.token.access_token),
    headers:
    {'cache-control': 'no-cache',
      'accept-language': 'application/json',
      'content-type': 'application/json' },
    body: bodys,
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.hasOwnProperty('error')) {
      console.log(body.error_description);
      res.json(sendResult(req, body));
    }
    else if(isEmptyObject(body)){
      res.json(sendResult(req, {error: "Input invalido"}));
    }else{
      res.json(sendResult(req, body));
    }
  });
}
