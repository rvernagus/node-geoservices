var geoservices = require('../');
var assert = require('assert');
var nock = require('nock');

function getTest(requestedPath, expectedPath, filter) {
  return function(beforeExit) {
    if (typeof(filter) === 'undefined') filter = true;
    
    var req = nock('http://example.com');
    if (filter) req = req.filteringPath(/\?.+$/, '');
    req.get(expectedPath || '').reply();
    
    geoservices.get({ host: 'example.com', path: requestedPath });
    
    beforeExit(function() {
      req.done();
      nock.cleanAll();
    });
  };
}

module.exports = {
  'get requests the specified URL': getTest('/ArcGIS/rest/services', '/ArcGIS/rest/services', true),
  
  'get allows null path': getTest(null, '', true),
  
  'get allows undefined path': getTest(undefined, '', true),
  
  'get adds json format parameter': getTest('', '?f=json', false),
  
  'leaves format parameter if present': getTest('?f=pson', '?f=pson', false)
};