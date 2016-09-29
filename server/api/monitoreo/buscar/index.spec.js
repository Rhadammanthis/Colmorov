'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var buscaMonitoreosCtrlStub = {
  index: 'buscaMonitoreosCtrl.index',
  show: 'buscaMonitoreosCtrl.show',
  create: 'buscaMonitoreosCtrl.create',
  update: 'buscaMonitoreosCtrl.update',
  destroy: 'buscaMonitoreosCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var buscaMonitoreosIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './buscaMonitoreos.controller': buscaMonitoreosCtrlStub
});

describe('BuscaMonitoreos API Router:', function() {

  it('should return an express router instance', function() {
    expect(buscaMonitoreosIndex).to.equal(routerStub);
  });

  describe('GET /api/monitoreos/todos', function() {

    it('should route to buscaMonitoreos.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'buscaMonitoreosCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/monitoreos/todos/:id', function() {

    it('should route to buscaMonitoreos.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'buscaMonitoreosCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/monitoreos/todos', function() {

    it('should route to buscaMonitoreos.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'buscaMonitoreosCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/monitoreos/todos/:id', function() {

    it('should route to buscaMonitoreos.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'buscaMonitoreosCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/monitoreos/todos/:id', function() {

    it('should route to buscaMonitoreos.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'buscaMonitoreosCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/monitoreos/todos/:id', function() {

    it('should route to buscaMonitoreos.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'buscaMonitoreosCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
