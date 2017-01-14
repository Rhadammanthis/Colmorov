/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/movies              ->  index
 * POST    /api/movies              ->  create
 * GET     /api/movies/:id          ->  show
 * PUT     /api/movies/:id          ->  update
 * DELETE  /api/movies/:id          ->  destroy
 */

'use strict';

var request = require("request");

import _ from 'lodash';
import List from './list.model';

var cast = false;
var crew = false;

var page = 0;
var itemsPerPage = 24;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      console.log(entity);
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Movies
export function index(req, res) {

  cast = req.query.cast || false;
  crew = req.query.crew || false;

  console.log('Cast in List = ' + cast);
  console.log('Crew in List = ' + crew);

  return List.find().exec()
    .then(respondWithResultArray(res))
    .catch(handleError(res));
}

// Gets a paginated list of Movies
export function paginated(req, res) {

  cast = req.query.cast || false;
  crew = req.query.crew || false;

  page = req.params.page;

  console.log('Cast in List = ' + cast);
  console.log('Crew in List = ' + crew);

  return List.find().exec()
    .then(respondWithResultArray(res))
    .catch(handleError(res));
}

function respondWithResultArray(res, statusCode) {
  statusCode = statusCode || 200;

  var lCast, lCrew, lPage, lItems;
  lCast = cast;
  lCrew = crew;
  lPage = page;
  lItems = itemsPerPage;

  return function(entity) {
    if (entity) {
      var resp = {};
      resp.id = [];
      
      if(lPage){
        for(var i = ((lItems * lPage) - lItems); i < (lItems * lPage); i++){
          if(i < entity.length){
            var id = entity[i].mdb_id;
            resp.id.push(id);
          }
        }
      }
      else{
        for(var i in entity){
          var id = entity[i].mdb_id;
          resp.id.push(id);
        }
      }

      console.log('Items in resp: ' + resp.length);
      console.log(resp);

      var options = {
        uri: 'http://localhost:3000/api/movies' + '?cast=' + cast + '&crew=' + crew,
        method: 'POST',
        json: resp
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          var result = {};
          result.movies = [];

          var listId = ((lItems * lPage) - lItems) + 1;

          for(var i in body){

            if(body[i])
            {
              var item = {};
              item.title = body[i].original_title;

              item.poster = {};
              item.poster.height = 1500;
              item.poster.width = 1000;
              item.poster.file_path = 'https://image.tmdb.org/t/p/w600/' + body[i].poster_path;

              item.list_id = listId;
              item.mdb_id = entity[i].mdb_id;

              if(cast)
                item.cast = body[i].cast;
              if(crew)
                item.crew = body[i].crew;

              listId++;

              result.movies.push(item);
            }
          }

          result.total = body.length;
          res.status(statusCode).json(result);
          // console.log(body.id) // Print the shortened ur
        }
        else{
          console.log('error');
          console.log(error);
        }
      });

      
    }
  };
}

// Gets a single List from the DB
export function show(req, res) {
  return List.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new List in the DB
export function create(req, res) {
  console.log('~~~~~~~~')
  console.log(req.body);
  return List.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing List in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return List.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a List from the DB
export function destroy(req, res) {
  return List.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
