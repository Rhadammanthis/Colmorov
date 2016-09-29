'use strict';

var app = require('../..');
import request from 'supertest';

var newBuscar;

describe('Buscar API:', function() {

  describe('GET /api/eventos/buscar', function() {
    var buscars;

    beforeEach(function(done) {
      request(app)
        .get('/api/eventos/buscar')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buscars = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(buscars).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/eventos/buscar', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/eventos/buscar')
        .send({
          name: 'New Buscar',
          info: 'This is the brand new buscar!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBuscar = res.body;
          done();
        });
    });

    it('should respond with the newly created buscar', function() {
      expect(newBuscar.name).to.equal('New Buscar');
      expect(newBuscar.info).to.equal('This is the brand new buscar!!!');
    });

  });

  describe('GET /api/eventos/buscar/:id', function() {
    var buscar;

    beforeEach(function(done) {
      request(app)
        .get('/api/eventos/buscar/' + newBuscar._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buscar = res.body;
          done();
        });
    });

    afterEach(function() {
      buscar = {};
    });

    it('should respond with the requested buscar', function() {
      expect(buscar.name).to.equal('New Buscar');
      expect(buscar.info).to.equal('This is the brand new buscar!!!');
    });

  });

  describe('PUT /api/eventos/buscar/:id', function() {
    var updatedBuscar;

    beforeEach(function(done) {
      request(app)
        .put('/api/eventos/buscar/' + newBuscar._id)
        .send({
          name: 'Updated Buscar',
          info: 'This is the updated buscar!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBuscar = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBuscar = {};
    });

    it('should respond with the updated buscar', function() {
      expect(updatedBuscar.name).to.equal('Updated Buscar');
      expect(updatedBuscar.info).to.equal('This is the updated buscar!!!');
    });

  });

  describe('DELETE /api/eventos/buscar/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/eventos/buscar/' + newBuscar._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when buscar does not exist', function(done) {
      request(app)
        .delete('/api/eventos/buscar/' + newBuscar._id)
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
