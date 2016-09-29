import mongoose from 'mongoose';

var CodigoYuniusSchema = new mongoose.Schema({
  codigo: String,
  codigoRed: String
});

export default mongoose.model('Codigoyunius', CodigoYuniusSchema);