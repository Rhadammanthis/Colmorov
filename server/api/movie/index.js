'use strict';

var express = require('express');
var http = require('http');
var controller = require('./movie.controller');
var request = require("request");
var async = require('async');

var router = express.Router();

var idArray = [];
var movies = null;

var cast = false;
var crew = false;

var response;

router.post('/new', controller.create);
router.get('/', controller.index);
router.delete('/:id', controller.destroy);

router.post('/', function(req, resp)
{

    //checks if 'Cast' should be included in reponse
    cast = req.query.cast || false;
    crew = req.query.crew || false;

    console.log('Cast = ' + cast);
    console.log('Crew = ' + crew);

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
            response.json(results);
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
            return cb(error)
        }

        var infoData;
        if(movieInfo != null)
            infoData = JSON.parse(movieInfo);    
        else{
            infoData = {};
            infoData.backdrop_path = "error";
            infoData.original_title = "I am error";
            infoData.overview = "Once upon a time an error";
            infoData.poster_path = "error";
            infoData.release_date = "error";
            infoData.id = "0";
        }

        movie.backdrop_path = infoData.backdrop_path;
        movie.original_title = infoData.original_title;
        movie.overview = infoData.overview;
        movie.poster_path = infoData.poster_path;
        movie.release_date = infoData.release_date;
        movie.id = infoData.id;

        //query 'Cast' and 'Crew' data if applicable 
        console.log('Cast or Crew is ON = ' + cast || crew)
        if(cast || crew){

            var creditsOptions = { method: 'GET',
                url: 'http://api.themoviedb.org/3/movie/'+ id +'/credits',
                qs: { api_key: '531aec356bbd54359474847e57c79986' },
                headers: 
                {'cache-control': 'no-cache' } 
            };

            request(creditsOptions, function (error, response, credits) {

                if (error) {
                    return cb(error)
                }

                var creditsData = JSON.parse(credits);

                movie.cast = [];
                movie.crew = [];

                if(cast)
                    for(var i in creditsData.cast){
                        var cast = creditsData.cast[i];
                        movie.cast.push(cast);
                    }

                if(crew)
                    for(var i in creditsData.crew){
                        var crew = creditsData.crew[i];
                        movie.crew.push(crew);
                    }

                if(movie.hasOwnProperty('error')){
                    return cb(movie.error_description)
                }
                else{

                    console.log('Fetched in credits: ' + movie.original_title);

                    cb(null, movie);
                }
            });

        }
        else{

            if(movie.hasOwnProperty('error')){
                return cb(movie.error_description)
            }
            else{
                console.log('Fetched in info: ' + movie.original_title);
                cb(null, movie);
            }
        }
        


            // var imagesOptions = { method: 'GET',
            //     url: 'http://api.themoviedb.org/3/movie/'+ id +'/images',
            //     qs: { api_key: '531aec356bbd54359474847e57c79986' },
            //     headers: 
            //     {'cache-control': 'no-cache' } 
            // };

            // console.log('Requesting images with id: ' + id);

            // request(imagesOptions, function (error, response, images){
                
            //     if (error) {
            //         cb(error)
            //     }

            //     var imagesData = JSON.parse(images);
        
            //     movie.backdrops = [];
            //     movie.posters = [];

            //     for(var i in imagesData.backdrops){
            //         var backdrop = imagesData.backdrops[i];
            //         movie.backdrops.push(backdrop);
            //     }

            //     for(var i in imagesData.backdrops){
            //         var poster = imagesData.posters[i];
            //         movie.posters.push(poster);
            //     }

            //     if(movie.hasOwnProperty('error')){
            //         cb(movie.error_description)
            //     }
            //     else{

            //         console.log('Fetched: ' + movie.original_title);

            //         cb(null, movie);
            //     }
                
            // });
        
    });
}

/**lol */

module.exports = router;
