/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/monitoreo/buscar              ->  index
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInput(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
    }
    if(body.hasOwnProperty('fechaini')){
        input.fechaini = body.fechaini;
    }
    if(body.hasOwnProperty('fechafin')){
        input.fechafin = body.fechafin;
    }
    input.limite = 20;
    if(body.hasOwnProperty('siguiente')){
        input.inicio = body.siguiente;
    }else{
        input.inicio = 0;
    }
    return input;
}

function formatResponse(input,  output){
    if((input.inicio + input.limite) < output.total){
        output.siguiente = input.inicio + input.limite;
    }else{
        delete output.siguiente;
    }
    return output;
}

export function index(req, res){
    var bodys = parseInput(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/monitoreo/get'),
        qs: { access_token: req.user.token.access_token },
        headers: 
            {'cache-control': 'no-cache',
            'accept-language': 'application/json',
            'content-type': 'application/json' },
        body: bodys,
        json: true 
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(body.hasOwnProperty('error')){
			console.log(body.error_description);
			res.json(body);
		}else{
            /**
             * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
             */
            res.json(sendResult(req,formatResponse(bodys, body)));
        }
    });
}