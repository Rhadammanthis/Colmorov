'use strict';

import express from 'express';

var router = express.Router();

router.use('/buscar',require('./buscar'));

module.exports = router;
