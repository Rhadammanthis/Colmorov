'use strict';

import express from 'express';
import {Router} from 'express';
import * as controller from './buscar.controller';
import * as auth from '../../../auth/auth.service';

var router = new Router();

router.post('/individuales', auth.isAuthenticated(), auth.refresh(), controller.individual);
router.post('/grupos', auth.isAuthenticated(), auth.refresh(), controller.grupo);
router.post('/individualdegrupo', auth.isAuthenticated(), auth.refresh(), controller.individualgrupo);

module.exports = router;
