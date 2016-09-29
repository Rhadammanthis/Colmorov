'use strict';

import CodigoEm from './codigo.model';

export function findCodigoEmp(emp){
	return CodigoEm.findOne({empresa:emp}).exec();
}

export function findCodigo(cod){
	return CodigoEm.findOne({codigo:cod}).exec();
}

export function findUlIn() {
	return CodigoEm.findOne({ "$query":{}, "$orderby":{ "_id": -1 }}).exec();
}

export function createCodEmp(cod,emp){
	console.log(cod,emp)
	return new CodigoEm({
      codigo: cod,
      empresa: emp
    }).save();
}