/**
 * Using Rails-like standard naming convention for endpoints.
 * POST     /api/eventos/crear              ->  index
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
    }
    if(body.hasOwnProperty('fecha')){
        input.fecha = body.fecha;
    }
    return input;
}

// Set the events
export function index(req, res) {
    var bodys = parseInput(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/monitoreo/evento/eliminar/set?access_token=' + req.user.token.access_token),
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
