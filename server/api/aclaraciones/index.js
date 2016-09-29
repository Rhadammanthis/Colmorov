'use strict';

import {Router} from 'express';

var router = new Router();

router.use('/buscar',require('./buscar'));
router.use('/crear',require('./crear'));
router.use('/mensaje', require('./mensaje'));
router.use('/cliente',require('./obtener'));
router.use('/terminar', require('./terminar'));

module.exports = router;
