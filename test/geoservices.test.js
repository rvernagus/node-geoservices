var geoservices = require('../');
var assert = require('assert');
var nock = require('nock');

module.exports = {
  'get requests the specified URL': function(beforeExit) {
    var req = nock('http://example.com')
      .filteringPath(/\?.+$/, '')
      .get('/ArcGIS/rest/services')
      .reply();
    
    geoservices.get({ host: 'example.com', path: '/ArcGIS/rest/services' });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  },
  
  'get allows null path': function(beforeExit) {
    var req = nock('http://example.com')
      .filteringPath(/\?.+$/, '')
      .get('')
      .reply();
    
    geoservices.get({ host: 'example.com', path: null });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  },
  
  'get allows missing path': function(beforeExit) {
    var req = nock('http://example.com')
      .filteringPath(/\?.+$/, '')
      .get('')
      .reply();
    
    geoservices.get({ host: 'example.com' });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  },
  
  'get adds json format parameter': function(beforeExit) {
    var req = nock('http://example.com')
      .get('?f=json')
      .reply();
    
    geoservices.get({ host: 'example.com' });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  },
};