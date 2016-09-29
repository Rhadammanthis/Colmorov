/**
 * Using Rails-like standard naming convention for endpoints.
 * POST   api/aclaraciones/terminar/set      ->  set
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';



/**
 * return true if the object has properties or false if the object is empty
 * @param obj the object to test
 * @returns {boolean}
 */
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

/**
 * Will generate the inputAclaracionMesaje needed for the WS
 * @param body should contain  {texto, id: {cdgem, cdgdac}}
 * @param client with {cl: {id: {cdgem, codigo}}}
 * @returns {{tipo fregistro estado id cdgem cdgpar}}
 **/
function createInputTerminar(body, user) {
  var terminarInput  = {id: {}};
  terminarInput.id.cdgacl = body.id.cdgacl;
  terminarInput.id.cdgpar = user.cl.id.codigo;
  terminarInput.id.cdgem = user.cl.id.cdgem;
  return terminarInput;
}

export function set(req, res) {
  var bodys = createInputTerminar(req.body, req.user);
  var options = { method: 'POST',
    url: url('api/aclaraciones/terminar/set?access_token=' + req.user.token.access_token),
    headers:
    {'cache-control': 'no-cache',
      'accept-language': 'application/json',
      'content-type': 'application/json' },
    body: bodys,
    json: true
  };

  request(options, function (error, response, body) {
    if(error) throw new Error(error);
    if(body.hasOwnProperty('error')){
      console.log(body.error_description);
      res.json(sendResult(req, body));
    }else if(isEmptyObject(body)){
      res.json(sendResult(req, {'error': 'Invalid input'}));
    }else{
      res.json(sendResult(req, body));
    }
  });
}
