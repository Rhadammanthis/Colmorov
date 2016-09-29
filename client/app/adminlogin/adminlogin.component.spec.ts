'use strict';

describe('Component: AdminloginComponent', function() {
  // load the controller's module
  beforeEach(module('yuniusApp.adminlogin'));

  var AdminloginComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminloginComponent = $componentController('adminlogin', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
