'use strict';

import mongoose from 'mongoose';

var CodigoEmpresaSchema = new mongoose.Schema({
  codigo: Number,
  empresa: String
});

export default mongoose.model('Codigoempresa', CodigoEmpresaSchema);