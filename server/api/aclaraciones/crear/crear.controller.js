/**
 * Using Rails-like standard naming convention for endpoints.
 * POST   /api/aclaraciones/crear      ->  create
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

/**
  * Will generate the inputAclaracion needed for the WS
  * @param body should contain  {tipo: ,fregistro: ,estado:}
  * @param client with {cl: {id: {cdgem, codigo}}}
  * @returns {{tipo fregistro estado id cdgem cdgpar}}
 **/
function parseInputAclaracion(body, user) {
  var input = {id: {}};
  input.tipo = body.tipo;
  input.fregistro = body.fregistro;
  input.estado = body.estado;
  input.id.cdgem = user.cl.id.cdgem;
  input.id.cdgpar = user.cl.id.codigo;
  return input;
}

/**
* return true if the object has properties or false if the object is empty
* @param obj the object to test
* @returns {boolean}
*/
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

export function create(req, res){
  // Valores necesarios para la petición de monitoreo
  var bodys = parseInputAclaracion(req.body,req.user);
  var options = { method: 'POST',
    url: url('api/aclaraciones/nueva/set?access_token=' + req.user.token.access_token),
    headers:
    {'cache-control': 'no-cache',
      'accept-language': 'application/json',
      'content-type': 'application/json' },
    body: bodys,
    json: true
  };
  //Request de monitoreo a WS
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.hasOwnProperty('error')) {
      console.log(body.error_description);
      res.json(sendResult(req, body));
    }
    else if(isEmptyObject(body)){
      res.json(sendResult(req, {error: "Input invalido"}));
    }
    else{
      /**
       * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
       */
      res.json(sendResult(req, body));
    }
  });

}