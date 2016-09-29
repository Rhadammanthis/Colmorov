/**
 * Using Rails-like standard naming convention for endpoints.
 * POST     /api/eventos/buscar              ->  index
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';


// Gets a list of Buscar
export function index(req, res) {
  function parseInput(body, cdgem) {
    var input = {};
    input.cdgem = cdgem;
    input.cdgclns = body.cdgclns;
    input.ciclo = body.ciclo;
    input.clns = body.clns;
    input.fecha = body.fecha;
    input.cdgcl = body.cdgcl;
    console.log(input);
    return input;
  }

  var bodys = parseInput(req.body, req.user.cl.id.cdgem);
  var options = { method: 'POST',
    url: url('api/reporte/estadodecuenta/get?access_token=' + req.user.token.access_token),
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
    }
    else{
      /**
       * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
       */
      res.json(sendResult(req,body));
    }
  });
}

