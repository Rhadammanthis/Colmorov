/**
 * Using Rails-like standard naming convention for endpoints.
 * POST     /api/eventos/crear              ->  index
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInput(body,data){
    var input = {};
    input.id = {};
    input.id.cdgem = data.empresa.codigo;
    input.cdgper = data.usuario.codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
        if(body.hasOwnProperty('cdgclns'))
        input.id.cdgclns = body.id.cdgclns;
        if(body.hasOwnProperty('cdgcl'))
        input.id.cdgcl = body.id.cdgcl;
        if(body.hasOwnProperty('cdgns'))
        input.id.cdgns = body.id.cdgns;
        if(body.hasOwnProperty('clns'))
        input.id.clns = body.id.clns;
    }
    input.creado = "W";
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
    if(body.hasOwnProperty('fechas')){
        input.fechas = body.fechas;
    }
    return input;
}

// Set the events
export function index(req, res) {
    var bodys = parseInput(req.body, req.user.data);
    var options = { method: 'POST',
        url: url('api/monitoreo/evento/set?access_token=' + req.user.token.access_token),
        headers: 
            {'cache-control': 'no-cache',
            'accept-language': 'application/json',
            'content-type': 'application/json' },
        body: bodys,
        json: true 
    };
    console.log(options);
    request(options, function (error, response, body) 
    {
        console.log(body);
        if (error) throw new Error(error);
        if(body.hasOwnProperty('error'))
        {
          console.log(body.error_description);
          res.json(body);
        }
        else
        {
            /** 
             * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
             */
            res.json(sendResult(req,body));
        }
    });
}
