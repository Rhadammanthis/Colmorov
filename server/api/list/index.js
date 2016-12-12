'use strict';

var express = require('express');
var http = require('http');
var controller = require('./list.controller');
var request = require("request");
var async = require('async');

var router = express.Router();

var idArray = [];
var movies = null;

var response;

router.post('/add', controller.create);
router.get('/', controller.index);
router.get('/:page', controller.paginated);
router.delete('/:id', controller.destroy);

module.exports = router;
