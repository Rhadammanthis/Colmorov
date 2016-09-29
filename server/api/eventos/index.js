'use strict';

import {Router} from 'express';

var router = new Router();

router.use('/buscar',require('./buscar'));
router.use('/crear',require('./crear'));
router.use('/actualizar',require('./actualizar'));
router.use('/eliminar',require('./eliminar'));

module.exports = router;
