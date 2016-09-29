'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var buscarCtrlStub = {
  index: 'buscarCtrl.index',
  show: 'buscarCtrl.show',
  create: 'buscarCtrl.create',
  update: 'buscarCtrl.update',
  destroy: 'buscarCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var buscarIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './buscar.controller': buscarCtrlStub
});

describe('Buscar API Router:', function() {

  it('should return an express router instance', function() {
    expect(buscarIndex).to.equal(routerStub);
  });

  describe('GET /api/eventos/buscar', function() {

    it('should route to buscar.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'buscarCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/eventos/buscar/:id', function() {

    it('should route to buscar.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'buscarCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/eventos/buscar', function() {

    it('should route to buscar.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'buscarCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/eventos/buscar/:id', function() {

    it('should route to buscar.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'buscarCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/eventos/buscar/:id', function() {

    it('should route to buscar.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'buscarCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/eventos/buscar/:id', function() {

    it('should route to buscar.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'buscarCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
