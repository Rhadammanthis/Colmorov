/**
 * Using Rails-like standard naming convention for endpoints.
 * POST     /api/aclaraciones/buscar       ->  index
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';


// Gets a list of Buscar
export function index(req, res) {
    var bodys = parseInput(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/aclaraciones/cliente/get?access_token=' + req.user.token.access_token),
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
            // console.log(body);
            res.json(sendResult(req,parseResponse(body)));
        }
    });
}

function  parseInput(body,codigo){
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;

    if(body.hasOwnProperty('estado')){
        input.estado = body.estado;
    }

    return input;
}

function parseResponse(body)
{
    var response = {};
    response.pearray = [];
    response.pearray = body.aclarray;

    return response;
}
