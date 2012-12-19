var assert, expectRequest, geoservices, getUrlTest, nock;

geoservices = require("../");

assert = require("assert");

nock = require("nock");

expectRequest = function(requestedPath, expectedPath, response, filter) {
  var req;
  if (filter == null) filter = true;
  req = nock("http://example.com");
  if (filter) req = req.filteringPath(/\?.+$/, "");
  req.get(expectedPath || "").reply(200, response);
  return req;
};

getUrlTest = function(requestedPath, expectedPath, filter) {
  return function(beforeExit) {
    var req;
    req = expectRequest(requestedPath, expectedPath, "{}", filter);
    geoservices.get({
      host: "example.com",
      path: requestedPath
    }, function() {});
    return beforeExit(function() {
      req.done();
      return nock.cleanAll();
    });
  };
};

module.exports = {
  "get requests the specified URL": getUrlTest("/ArcGIS/rest/services", "/ArcGIS/rest/services", true),
  "get allows null path": getUrlTest(null, "", true),
  "get allows undefined path": getUrlTest(void 0, "", true),
  "get adds json format parameter": getUrlTest("", "?f=json", false),
  "get leaves format parameter if present": getUrlTest("?f=pson", "?f=pson", false),
  "get parses and returns response": function(beforeExit) {
    var req;
    req = expectRequest("", "", '{ "success": true }', true);
    return geoservices.get({
      host: "example.com",
      path: ""
    }, function(result) {
      return assert.eql(result, {
        success: true
      });
    });
  }
};
