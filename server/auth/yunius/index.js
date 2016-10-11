/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /auth/yunius/pe/login          
 * POST    /auth/yunius/cl/registro           
 * GET     /auth/yunius/cl/login        
 */
'use strict';

import express from 'express';
import {setTokenCookie} from '../auth.service';
import url from '../../components/utils/url';
import request from 'request';
import {signTokenC} from '../auth.service';
import CodigoYunius from '../empresa/secreto.model';
import {findCodigoEmp} from '../empresa/consultas';
import {findUlIn} from '../empresa/consultas';
import {createCodEmp} from '../empresa/consultas';
import {findCodigo} from '../empresa/consultas';
import {signToken} from '../auth.service';
import {signTokenU} from '../auth.service';

var router = express.Router();

function jsonRegistro(body,cadena) {
	var info = cadena.split(".");
	return {
					id: {
						cdgem: info[0],
						cdgcl: info[1] },
					usuario: body.usuario,
					nombre: body.nombre,
					telefono: body.telefono,
					correo: body.correo,
					contrasena: body.contrasena,
					codigo: info[2] };
}

function decoCadena(codigo){
	return (new Buffer(codigo, 'base64')).toString();
}

router.post('/pe/login', function(req, res, next){
	var optionsGetToken = { method: 'POST',
  		url: url('oauth/token'),
  		headers: 
   			{ 'content-type': 'application/x-www-form-urlencoded',
     		'cache-control': 'no-cache' },
  		form: 
   			{ grant_type: 'password',
     		client_id: 'YUNIUS_WEB',
     		client_secret: '4yGuH7Wg456hrO2PtxfmqfMAFyukysCAKSqnMPq7p1jraH2OXxuVLYi93Uo6h9Gm',
     		username: req.body.empresa+'_'+req.body.usuario,
     		password: req.body.claveUs } 
      };
	  console.log(optionsGetToken);
	request(optionsGetToken, function (error, response, token) {
		if (error){
	  		throw new Error(error);
		}
		token = JSON.parse(token);
		console.log('Expires='+token.expires_in);
		console.log('Scope='+token.scope);
		if(token.hasOwnProperty('error')){
			if(token.error == 'invalid_grant'){
				token.code = '001';
			}else if(token.error == 'unauthorized'){
				token.code = '002';
			}else{
				token.code = '404';
			}
			token.active = false;
			console.log(token.error_description);
			res.json(token);
		}else{
			var optionsLogin = { method: 'POST',
								url: url('api/general/login'),
								qs: { access_token: token.access_token },
								headers: { 'content-type': 'application/json' },
								body: req.body,
								json: true };
							
			request(optionsLogin, function (error, response, bodyLog) {
	  			if (error){ 
					throw new Error(error);
	  			}
				var aut = {};
	  			if(!bodyLog.hasOwnProperty('error') && Object.keys(bodyLog).length !== 0){
					aut.active = true;
					aut.usuario = "";
					if(bodyLog.usuario.nombre1 !== null && bodyLog.usuario.nombre1 !== undefined){
						aut.usuario += bodyLog.usuario.nombre1;
					}
					if(bodyLog.usuario.nombre2 !== null && bodyLog.usuario.nombre2 !== undefined){
						aut.usuario += " "+bodyLog.usuario.nombre2;
					}
					if(bodyLog.usuario.primape !== null && bodyLog.usuario.primape !== undefined){
						aut.usuario += " "+bodyLog.usuario.primape;
					}
					if(bodyLog.usuario.segape !== null && bodyLog.usuario.segape !== undefined){
						aut.usuario += " "+bodyLog.usuario.segape;
					}
					aut.empresa = bodyLog.empresa.nombre;
					aut.permisos = {};
					// if(bodyLog.permisos.hasOwnProperty('administracion_monitoreo')){
					// 	aut.permisos.administracion_monitoreo = bodyLog.permisos.administracion_monitoreo;
					// }else{
					// 	aut.permisos.administracion_monitoreo = '0000';
					// }
					if(bodyLog.permisos.hasOwnProperty('responder_aclaraciones')){
						aut.permisos.responder_aclaraciones = bodyLog.permisos.responder_aclaraciones;
					}else{
						aut.permisos.responder_aclaraciones = '0000';
					}
					// if(bodyLog.permisos.hasOwnProperty('registro_monitoreo')){
					// 	aut.permisos.registro_monitoreo = bodyLog.permisos.registro_monitoreo;
					// }else{
					// 	aut.permisos.registro_monitoreo = '0000';
					// }
                	res.json({ datos : aut, token: signTokenU(bodyLog, token) });
	  			}else{
					aut.active = false;
					aut.code = '001';
					aut.errorObject = bodyLog;
					res.json(aut);
				}
			});
		}
  });
});

router.post('/cl/registro', function(req, res, next){
	CodigoYunius.findOne({codigoRed:req.body.codigo}).exec(function(err,codigo) {
		if(err === null || err === undefined){
			if(codigo !== null && codigo !== undefined){
				var cad = decoCadena(codigo.codigo);
				var options = { method: 'POST',
					url: url('general/registroweb/set'),
					headers: {
						'cache-control': 'no-cache',
						'content-type': 'application/json' },
					body: jsonRegistro(req.body,cad),
					json: true };
					console.log(options);
				request(options, function (error, response, body) {
					if (error) throw new Error(error);
					console.log(body);
					if(body.hasOwnProperty('estatus')&&body.estatus==='USUARIO CREADO CORRECTAMENTE'){
						findCodigoEmp(options.body.id.cdgem)
							.then(function(result) {
								if(result !== null && result !== null){
									res.json({codigo:result.codigo+"."+options.body.id.cdgcl});
								}else{
									findUlIn().then(function(result) {
										console.log(result);
										var cdg = 1001;
										if(result !== null && result !== null){
											cdg = ++result.codigo;
										}
										createCodEmp(cdg,options.body.id.cdgem)
											.then(function(result){
												//Enviar correo
												res.json({codigo:result.codigo+"."+options.body.id.cdgcl});
											});
									});
								}
							});
					}else{
						res.json(body);
					}
				});
			}else{
				res.json({error:"El código de verificación no existe",codigoerror:"G001"});
			}
		}else{
			res.json({error:err});
		}
	});
});

router.post('/cl/login', function(req, res, next){
	var info = req.body.usuario.split(".");
	findCodigo(info[0])
		.then(function(result) {
			console.log(result);
			if(result !== null && result !== null){
				var options = { method: 'POST',
					url: url('oauth/token'),
					headers:
						{ 'content-type': 'application/x-www-form-urlencoded',
						'cache-control': 'no-cache' },
					form:
						{ grant_type: 'password',
						client_id: 'YUNIUS_WEB',
						client_secret: '4yGuH7Wg456hrO2PtxfmqfMAFyukysCAKSqnMPq7p1jraH2OXxuVLYi93Uo6h9Gm',
						username: result.empresa+'_ACL_'+info[1],
						password: req.body.contrasena }
				};
				request(options, function (error, response, token) {
					if (error) throw new Error(error);
					token = JSON.parse(token);
					console.log('Expires='+token.expires_in);
					console.log('Scope='+token.scope);
					if(token.hasOwnProperty('error')){
						if(token.error == 'invalid_grant'){
							token.code = '001';
						}else if(token.error == 'unauthorized'){
							token.code = '002';
						}else{
							token.code = '404';
						}
						token.active = false;
						console.log(token.error_description);
						res.json(token);
					}else{
						var send = {
							id:{
								cdgem:result.empresa,
								cdgcl:info[1]
							},
							contrasena:req.body.contrasena
						}
						options = { method: 'POST',
									url: url('api/general/accesocliente/get'),
									qs: { access_token: token.access_token },
									headers: { 'content-type': 'application/json' },
									body: send,
									json: true };
						request(options, function (error, response, body) {
							if (error){
								throw new Error(error);
							}
							var aut = {};
							if(!body.hasOwnProperty('error') && Object.keys(body).length !== 0){
								aut.active = true;
								aut.usuario = body.usuario;
								aut.nombre = body.nombre;
								aut.correo = body.correo;
								res.json({ datos : aut, token: signTokenC(body, token) });
							}else{
								aut.active = false;
								aut.code = '001';
								aut.errorObject = body;
								res.json(aut);
							}
						});
					}
				});
			}else{
				var err = {
					error:'No Existe',
					mensaje:'El uasuario es incorrecto',
					code:'010'
				};
				res.json(err);
			}
		}).catch(function(err) {
			var err = {
					error:'No Existe',
					mensaje:'El uasuario es incorrecto',
					errorObj:err,
					code:'010'
				};
			res.json(err);
		});
});

export default router;