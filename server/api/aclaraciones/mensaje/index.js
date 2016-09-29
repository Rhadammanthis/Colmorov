'use strict';

import {Router} from 'express';
import * as controller from './mensaje.controller';
import * as auth from '../../../auth/auth.service';

var router = new Router();

router.post('/', auth.isAuthenticated(), auth.refresh(), controller.getAll);
router.post('/editar', auth.isAuthenticated(), auth.refresh(), controller.edit);
router.post('/agregar', auth.isAuthenticated(), auth.refresh(), controller.create);

module.exports = router;
