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
    });
    return beforeExit(function() {
      req.done();
      return nock.cleanAll();
    });
  };
};

module.exports = {
  "get requests the specified URL": getUrlTest("/ArcGIS/rest/services", "/ArcGIS/rest/services"),
  "get throws error if no host": assert.throws(function() {
    return geoservices.get();
  }),
  "get allows null path": getUrlTest(null, ""),
  "get allows undefined path": getUrlTest(void 0, ""),
  "get adds json format parameter": getUrlTest("", "?f=json", false),
  "get leaves format parameter if present": getUrlTest("?f=pson", "?f=pson", false),
  "get adds params to querystring": function(beforeExit) {
    var req;
    req = expectRequest("", "?param1=value1&f=json", "{}", false);
    geoservices.get({
      host: "example.com",
      params: {
        param1: "value1"
      }
    });
    return beforeExit(function() {
      req.done();
      return nock.cleanAll();
    });
  },
  "get parses and returns response": function(beforeExit) {
    var req;
    req = expectRequest("", "", '{ "success": true }');
    geoservices.get({
      host: "example.com"
    }, function(result) {
      return assert.eql(result, {
        success: true
      });
    });
    return beforeExit(function() {
      req.done();
      return nock.cleanAll();
    });
  },
  "get returns an error object when response cannot be parsed": function(beforeExit) {
    var req;
    req = expectRequest("", "", "<xml>this is not json</xml>");
    geoservices.get({
      host: "example.com"
    }, function(result) {
      assert.isDefined(result.error);
      assert.isDefined(result.responseBody);
      assert.eql("Response body is not valid JSON", result.error);
      return assert.eql("<xml>this is not json</xml>", result.responseBody);
    });
    return beforeExit(function() {
      req.done();
      return nock.cleanAll();
    });
  }
};
