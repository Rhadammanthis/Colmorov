'use strict';

import {Router} from 'express';
import * as controller from './eliminar.controller';
import * as auth from '../../../auth/auth.service';

var router = new Router();

router.post('/', auth.isAuthenticated(), auth.refresh(), controller.index);

module.exports = router;
