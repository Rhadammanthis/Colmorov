'use strict';

var express = require('express');
var http = require('http');
var controller = require('./movie.controller');
var request = require("request");
var async = require('async');

var router = express.Router();

var idArray = [];
var movies = null;

var response;

router.post('/new', controller.create);
router.get('/', controller.index);
router.delete('/:id', controller.destroy);

router.post('/', function(req, resp)
{
    response = resp;
    movies = [];
    
    if(req.body.hasOwnProperty('id') == 0)
    {
        var error = {};
        error.message = 'No input detected';
        resp.json(error);
    }

    idArray = req.body.id;

    //async info fetch of as many items there are in the body of the request
    async.map(idArray, fetchMovieInfo, function(err, results){
        if ( err){
        console.log('error');
        } else {
            console.log('no error');
            
            response.json(results);
        }
    });

});

function fetchMovieInfo(index,cb)
{
    var movie = {};
    var id = index;

    var infoOptions = { method: 'GET',
        url: 'http://api.themoviedb.org/3/movie/' + id,
        qs: { api_key: '531aec356bbd54359474847e57c79986' },
        headers: 
        {'cache-control': 'no-cache' } 
    };

    console.log('Requesting info with id: ' + id);

    request(infoOptions, function (error, response, movieInfo) {
        
        if (error) {
            cb(error)
        }

        var infoData = JSON.parse(movieInfo);

        movie.backdrop_path = infoData.backdrop_path;
        movie.original_title = infoData.original_title;
        movie.overview = infoData.overview;
        movie.poster_path = infoData.poster_path;
        movie.release_date = infoData.release_date;
        movie.id = infoData.id;
        
        var creditsOptions = { method: 'GET',
            url: 'http://api.themoviedb.org/3/movie/'+ id +'/credits',
            qs: { api_key: '531aec356bbd54359474847e57c79986' },
            headers: 
            {'cache-control': 'no-cache' } 
        };

        console.log('Requesting credits with id: ' + id);

        request(creditsOptions, function (error, response, credits) {

            if (error) {
                cb(error)
            }

            var creditsData = JSON.parse(credits);

            movie.cast = [];
            movie.crew = [];

            for(var i in creditsData.cast){
                var cast = creditsData.cast[i];
                movie.cast.push(cast);
            }

            for(var i in creditsData.crew){
                var crew = creditsData.crew[i];
                movie.crew.push(crew);
            }

            var imagesOptions = { method: 'GET',
                url: 'http://api.themoviedb.org/3/movie/'+ id +'/images',
                qs: { api_key: '531aec356bbd54359474847e57c79986' },
                headers: 
                {'cache-control': 'no-cache' } 
            };

            console.log('Requesting images with id: ' + id);

            request(imagesOptions, function (error, response, images){
                
                if (error) {
                    cb(error)
                }

                var imagesData = JSON.parse(images);
        
                movie.backdrops = [];
                movie.posters = [];

                for(var i in imagesData.backdrops){
                    var backdrop = imagesData.backdrops[i];
                    movie.backdrops.push(backdrop);
                }

                for(var i in imagesData.backdrops){
                    var poster = imagesData.posters[i];
                    movie.posters.push(poster);
                }

                if(movie.hasOwnProperty('error')){
                    cb(movie.error_description)
                }
                else{

                    console.log('Fetched: ' + movie.original_title);

                    cb(null, movie);
                }
                
            });
        });
    });
}

/**lol */

module.exports = router;
