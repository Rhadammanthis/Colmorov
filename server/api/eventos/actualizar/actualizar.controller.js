/**
 * Using Rails-like standard naming convention for endpoints.
 * POST     /api/eventos/actualizar              ->  index
 */

'use strict';

import _ from 'lodash';
import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInput(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgev = body.id.cdgev;
        input.id.cdgclns = body.id.cdgclns;
        input.id.cdgcl = body.id.cdgcl;
        input.id.cdgns = body.id.cdgns;
        input.id.clns = body.id.clns;
    }
    if(body.hasOwnProperty('nombre')){
        input.nombre = body.nombre;
    }
    if(body.hasOwnProperty('direccion')){
        input.direccion = body.direccion;
    }
    if(body.hasOwnProperty('localizacion')){
        input.localizacion = body.localizacion;
    }
    if(body.hasOwnProperty('descripcion')){
        input.descripcion = body.descripcion;
    }
    process.stdout.write(JSON.stringify(input));
    return input;
}

// Set the events
export function index(req, res) {
    var bodys = parseInput(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/monitoreo/evento/actualizar/set?access_token=' + req.user.token.access_token),
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
        if(body.hasOwnProperty('error'))
        {
          console.log(body.error_description);
          res.json(body);
        }
        else
        {
            res.json(sendResult(req,body));
        }
    });
}
