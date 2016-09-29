/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/clientes/buscar/individuales              ->  individual
 * POST    /api/clientes/buscar/individualdegrupo         ->  individualgrupo
 * POST    /api/clientes/buscar/grupo                     ->  grupo
 */
'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInputG(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
        input.id.cdgns = body.id.cdgns;
    }
    if(body.hasOwnProperty('nombre')){
        input.nombre = body.nombre;
    }
    input.limite = 20;
    if(body.hasOwnProperty('siguiente')){
        input.inicio = body.siguiente;
    }else{
        input.inicio = 0;
    }
    return input;
}

function formatResponseG(input,  output){
    if((input.inicio + input.limite) < output.total){
        output.siguiente = input.inicio + input.limite;
    }else{
        delete output.siguiente;
    }
    return output;
}

export function grupo(req, res){
    var bodys = parseInputG(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/ns/get'),
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
            //Siempre se tiene que utilizar funcion senResult para enviar resultado del endpoint
            res.json(sendResult(req,formatResponseG(bodys, body)));
        }
    });
}

function parseInputIG(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.cdgem = codigo;
    if(body.id.hasOwnProperty('cdgns')){
        input.codigo = body.id.cdgns;
    }
    return input;
}

function formatResponseIG(input,  output){
    return output;
}

export function individualgrupo(req, res){
    var bodys = parseInputIG(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/ns/get'),
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
            //Siempre se tiene que utilizar funcion senResult para enviar resultado del endpoint
            res.json(sendResult(req,formatResponseIG(bodys, body)));
        }
    });
}

function parseInputI(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
        input.id.cdgcl = body.id.cdgcl;
    }
    if(body.hasOwnProperty('nombre')){
        input.nombre = body.nombre;
    }
    input.limite = 20;
    if(body.hasOwnProperty('siguiente')){
        input.inicio = body.siguiente;
    }else{
        input.inicio = 0;
    }
    return input;
}

function formatResponseI(input,  output){
    if((input.inicio + input.limite) < output.total){
        output.siguiente = input.inicio + input.limite;
    }else{
        delete output.siguiente;
    }
    return output;
}

export function individual(req, res){
    var bodys = parseInputI(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/cl/get'),
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
            //Siempre se tiene que utilizar funcion senResult para enviar resultado del endpoint
            res.json(sendResult(req,formatResponseI(bodys, body)));
        }
    });
}