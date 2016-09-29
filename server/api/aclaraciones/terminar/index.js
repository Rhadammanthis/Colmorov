'use strict';

import {Router} from 'express';
import * as controller from './set.controller';
import * as auth from '../../../auth/auth.service';

var router = new Router();

router.post('/set', auth.isAuthenticated(), auth.refresh(), controller.set);

module.exports = router;
