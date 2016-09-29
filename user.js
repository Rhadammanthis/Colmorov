'use strict';

var request = require('request');

/**
 * The User class
 */
class User {

    constructor(name) {
        this.name = name;
    }

    save(){
        request('http://www.google.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the Google homepage.
            }
        });
    }
}