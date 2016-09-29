/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/aclaraciones/cliente           ->  getAll
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInputAclaracion(cl) {
  console.log(cl);
  var input = {};
  
  input.id = {};
  input.id.cdgem = cl.id.cdgem;
  input.id.cdgpar = cl.id.codigo;

  return input; 
}

function parseResponse(body){
  /**
   * body = {'aclarray':[{'id':{'cdgem':"",'cdgacl':"", 'cdgpar':""}, 'tipo':"", 'fregistro':"", 'estado':""}]}
   */
  for(var i in body.aclarray){
    delete body.aclarray[i].id.cdgem;
    delete body.aclarray[i].id.cdgpar;
  }

  return body;
}

export function getAll(req, res){

  console.log('lol');
  console.log(req.user);

  var input = parseInputAclaracion(req.user.cl);

  var options = { method: 'POST',
    url: url('api/aclaraciones/cliente/get?access_token=' + req.user.token.access_token),
    headers:
    {'cache-control': 'no-cache',
      'accept-language': 'application/json',
      'content-type': 'application/json' },
    body: input,
    json: true
  };
  //Request de aclaraciones
  console.log('Gonna request now...');
  request(options, function (error, response, body) {
    console.log('Finished requesting');

    if (error) throw new Error(error);

    if (body.hasOwnProperty('error')) {
      console.log(body.error_description);
      res.json(body);
    }
    else{
      /** 
       * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
       */
      res.json(sendResult(req,parseResponse(body)));
    }
  });
}
