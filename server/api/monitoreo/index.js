'use strict';

import express from 'express';

var router = express.Router();

router.use('/buscar',require('./buscar'));
router.use('/detalle',require('./detalle'));
router.use('/personal',require('./personal'));

module.exports = router;
