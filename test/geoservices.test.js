var geoservices = require('../');
var assert = require('assert');
var nock = require('nock');

module.exports = {
  'get requests the specified URL': function(beforeExit) {
    var req = nock('http://example.com')
      .get('/users')
      .reply();
    
    geoservices.get({ host: 'example.com', path: '/users' });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  },
  
  'get allows null path': function(beforeExit) {
    var req = nock('http://example.com')
      .get(null)
      .reply();
    
    geoservices.get({ host: 'example.com', path: null });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  },
  
  'get allows missing path': function(beforeExit) {
    var req = nock('http://example.com')
      .get()
      .reply();
    
    geoservices.get({ host: 'example.com' });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  }
};