/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/monitoreo/detalle              ->  create
 */

'use strict';

import {sendResult} from '../../../auth/auth.service';
import url from '../../../components/utils/url';
import request from 'request';

/** 
 * Datos que recibe el request
*/
/*{
  “id”:{
     “cdgpe”:<String>, //Código del personal
     “cdgmon”:<int> //Código de monitoreo
   },
   “fecha”:<timestamp> //La fecha del monitoreo
}*/

function parseInputIn(body,codigo){
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    input.limite = 30;
    input.inicio = 0;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
    }
    if(body.hasOwnProperty('fecha')){
        input.fechaini = body.fecha;
        input.fechafin = body.fecha;
    }
    return input;
}

function parseInputMonitoreo(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
        input.id.cdgmon = body.id.cdgmon;
    }
    if(body.hasOwnProperty('fecha')){
        input.fecha = body.fecha;
    }
    return input;
}

function parseInputEvento(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
    }
    if(body.hasOwnProperty('fecha')){
        input.fecha = body.fecha;
    }
    return input;
}

function parseInputPuntos(body,codigo){
    console.log("-",codigo);
    var input = {};
    input.id = {};
    input.id.cdgem = codigo;
    if(body.hasOwnProperty('id')){
        input.id.cdgpe = body.id.cdgpe;
        input.id.cdgmon = body.id.cdgmon;
    }
    return input;
}

function formatResponse(respuestaMon,  respuestaEvento, respuestaPuntos){
    var respuesta = respuestaMon.substring(0, respuestaMon.length - 1)+ "," + respuestaEvento.substring(1, respuestaEvento.length - 1) + "," + respuestaPuntos.substring(1, respuestaPuntos.length);
    return respuesta;
}

export function index(req, res){
    //Valores necesarios para la petición del detalle de monitoreo
    var bodys = parseInputIn(req.body, req.user.data.empresa.codigo);
    var options = { method: 'POST',
        url: url('api/monitoreo/get?access_token=' + req.user.token.access_token),
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
        if(body.hasOwnProperty('error')){
			console.log(body.error_description);
			res.json(body);
		}
        else{
            //Valores necesarios para la petición del detalle de monitoreo
            bodys = parseInputMonitoreo(req.body, req.user.data.empresa.codigo);
            var options = { method: 'POST',
                url: url('api/monitoreo/get?access_token=' + req.user.token.access_token),
                headers: 
                    {'cache-control': 'no-cache',
                    'accept-language': 'application/json',
                    'content-type': 'application/json' },
                body: bodys,
                json: true 
            };
            //Request de detalle del monitoreo
            request(options, function (error, response, bodyDetalle) {
                if (error) throw new Error(error);
                if(body.hasOwnProperty('error')){
                    console.log(body.error_description);
                    res.json(body);
                }
                else{
                    //Valores necesarios para la petición de eventos
                    var bodysEventos = parseInputEvento(bodys, req.user.data.empresa.codigo);
                    var optionsEventos = { method: 'POST',
                        url: url('api/monitoreo/evento/get?access_token=' + req.user.token.access_token),
                        headers: 
                            {'cache-control': 'no-cache',
                            'accept-language': 'application/json',
                            'content-type': 'application/json' },
                        body: bodysEventos,
                        json: true 
                    };
                    //Request de eventos
                    request(optionsEventos, function (errorEvento, response, bodyEvento) {
                        if (errorEvento) throw new Error(errorEvento);
                        if(bodyEvento.hasOwnProperty('error')){
                            console.log(bodyEvento.error_description);
                            res.json(bodyEvento);
                        }
                        else{
                            //Valores necesarios para la petición de puntos de visita
                            var bodysPuntos = parseInputPuntos(bodys, req.user.data.empresa.codigo);
                            var optionsPuntos = { method: 'POST',
                                url: url('api/monitoreo/puntovisita/get?access_token=' + req.user.token.access_token),
                                headers: 
                                    {'cache-control': 'no-cache',
                                    'accept-language': 'application/json',
                                    'content-type': 'application/json' },
                                body: bodysPuntos,
                                json: true 
                            };
                            //Request de puntos visita
                            request(optionsPuntos, function (errorPuntos, response, bodyPuntos) {
                                if (errorPuntos) throw new Error(errorPuntos);
                                if(bodyPuntos.hasOwnProperty('error')){
                                    console.log(bodyPuntos.error_description);
                                    res.json(bodyPuntos);
                                }
                                else{
                                    var detalle = {};
                                    if(body.monarray.length!==0){
                                        detalle = body.monarray[0];
                                    }
                                    if(bodyDetalle.hasOwnProperty('dmonarray')){
                                        detalle.dmonarray = bodyDetalle.dmonarray;
                                    }
                                    if(bodyEvento.hasOwnProperty('eventosarray')){
                                        detalle.eventosarray = bodyEvento.eventosarray;
                                    }
                                    if(bodyPuntos.hasOwnProperty('puvarray')){
                                        detalle.puvarray = bodyPuntos.puvarray;
                                    }
                                    //Respuesta con la mezcla de los tres objetos obtenidos
                                    /** 
                                     * Simpre se tiene que utilizar funcion senResult para enviar resultado del endpoint
                                     */
                                    res.json(sendResult(req,detalle));
                                    
                                }
                            });

                        }
                    });
                }
            });
        }
    });
}
