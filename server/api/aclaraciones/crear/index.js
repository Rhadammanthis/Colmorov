'use strict';

import {Router} from 'express';
import * as controller from './crear.controller';
import * as auth from '../../../auth/auth.service';

var router = new Router();

router.post('/', auth.isAuthenticated(), auth.refresh(), controller.create);

module.exports = router;
