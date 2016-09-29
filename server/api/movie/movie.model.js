'use strict';

import mongoose from 'mongoose';

var MovieSchema = new mongoose.Schema({
  mdb_id: Number
});

export default mongoose.model('Movie', MovieSchema);
