/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/monitoreo/detalle              ->  create
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

function parseInputMonitoreo(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('siguiente')){
        input.inicio = body.siguiente;
    }else{
        input.inicio = 1;
    }
    if(body.hasOwnProperty('limite')){
        input.limite = body.limite;
    }else{
        input.limite = 20;
    }

    console.log(input)
    return input;
}

function parseResponse(input, output)
{
    for(var i in output.pearray){
        delete output.pearray[i].id.cdgem;
    }

    if((input.inicio + input.limite) < output.total){
        output.siguiente = input.inicio + input.limite;
    }else{
        delete output.siguiente;
    }
    return output;
}


export function getAll(req, res){
    //Valores necesarios para la petición de monitoreo
    var bodys = parseInputMonitoreo(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/monitoreo/pe/get?access_token=' + req.user.token.access_token),
        headers: 
            {'cache-control': 'no-cache',
            'accept-language': 'application/json',
            'content-type': 'application/json' },
        body: bodys,
        json: true 
    };
    //Request de monitoreo
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if (body.hasOwnProperty('error')) {
            console.log(body.error_description);
            res.json(body);
        }
        else{
            res.json(sendResult(req, parseResponse(bodys, body)));
        }
    });
}
