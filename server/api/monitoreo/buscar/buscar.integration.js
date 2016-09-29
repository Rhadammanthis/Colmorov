'use strict';

var app = require('../..');
import request from 'supertest';

var newBuscaMonitoreos;

describe('BuscaMonitoreos API:', function() {

  describe('GET /api/monitoreos/todos', function() {
    var buscaMonitoreoss;

    beforeEach(function(done) {
      request(app)
        .get('/api/monitoreos/todos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buscaMonitoreoss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(buscaMonitoreoss).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/monitoreos/todos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/monitoreos/todos')
        .send({
          name: 'New BuscaMonitoreos',
          info: 'This is the brand new buscaMonitoreos!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBuscaMonitoreos = res.body;
          done();
        });
    });

    it('should respond with the newly created buscaMonitoreos', function() {
      expect(newBuscaMonitoreos.name).to.equal('New BuscaMonitoreos');
      expect(newBuscaMonitoreos.info).to.equal('This is the brand new buscaMonitoreos!!!');
    });

  });

  describe('GET /api/monitoreos/todos/:id', function() {
    var buscaMonitoreos;

    beforeEach(function(done) {
      request(app)
        .get('/api/monitoreos/todos/' + newBuscaMonitoreos._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buscaMonitoreos = res.body;
          done();
        });
    });

    afterEach(function() {
      buscaMonitoreos = {};
    });

    it('should respond with the requested buscaMonitoreos', function() {
      expect(buscaMonitoreos.name).to.equal('New BuscaMonitoreos');
      expect(buscaMonitoreos.info).to.equal('This is the brand new buscaMonitoreos!!!');
    });

  });

  describe('PUT /api/monitoreos/todos/:id', function() {
    var updatedBuscaMonitoreos;

    beforeEach(function(done) {
      request(app)
        .put('/api/monitoreos/todos/' + newBuscaMonitoreos._id)
        .send({
          name: 'Updated BuscaMonitoreos',
          info: 'This is the updated buscaMonitoreos!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBuscaMonitoreos = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBuscaMonitoreos = {};
    });

    it('should respond with the updated buscaMonitoreos', function() {
      expect(updatedBuscaMonitoreos.name).to.equal('Updated BuscaMonitoreos');
      expect(updatedBuscaMonitoreos.info).to.equal('This is the updated buscaMonitoreos!!!');
    });

  });

  describe('DELETE /api/monitoreos/todos/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/monitoreos/todos/' + newBuscaMonitoreos._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when buscaMonitoreos does not exist', function(done) {
      request(app)
        .delete('/api/monitoreos/todos/' + newBuscaMonitoreos._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
