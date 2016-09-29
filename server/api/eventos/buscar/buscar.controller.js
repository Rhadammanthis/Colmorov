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
    if(req.body.hasOwnProperty('id')){
      req.body.id.cdgem = req.user.data.empresa.codigo;
    }
    var options = { method: 'POST',
        url: url('api/monitoreo/evento/get?access_token=' + req.user.token.access_token),
        headers: 
            {'cache-control': 'no-cache',
            'accept-language': 'application/json',
            'content-type': 'application/json' },
        body: req.body,
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
            /** 
             * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
             */
            res.json(sendResult(req,body));
        }
    });
}
