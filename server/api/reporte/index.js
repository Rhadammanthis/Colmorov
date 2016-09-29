'use strict';

import {Router} from 'express';

var router = new Router();

router.use('/estadodecuenta',require('./estadodecuenta'));

module.exports = router;
