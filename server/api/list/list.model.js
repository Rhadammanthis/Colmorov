'use strict';

import mongoose from 'mongoose';

var ListSchema = new mongoose.Schema({
  list_id: Number,
  mdb_id: Number
});

export default mongoose.model('List', ListSchema);
