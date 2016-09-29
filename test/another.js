'use strict'

var request = require('request');
var should = require('chai').should();
var expect = require('chai').expect;

var beverages = { tea: [ 'chai', 'matcha', 'oolong', 'earl grey' ] };

describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
    // console.log('before all');
  });

  after(function() {
    // runs after all tests in this block
    // console.log('after all');
  });

  beforeEach(function() {
    // runs before each test in this block
    // console.log('before each');
  });

  afterEach(function() {
    // runs after each test in this block
    // console.log('after each');
  });

  // test cases

  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });

  describe('#hasProperty()', function(){
    it('tea should have a length of 4', function(){
      beverages.should.have.property('tea').with.length(4); 
    });
  });

  describe('#hasProperty()', function(){
    it('tea should have a length of 4', function(){
      beverages.should.have.property('tea').with.length(4); 
    });
  });

  describe('#isAString()', function(){
    it('test is a string', function(){
      expect('test').to.be.a('string');
    });
  });

});

// describe('Array', function() {

// });

describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
  });
});

class User {

    constructor(name) {
        this.name = name;
    }

    save(done){
        request('http://www.google.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body) // Show the HTML for the Google homepage.
                done();
            }
        });
    }
}