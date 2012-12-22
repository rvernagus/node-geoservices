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
  return function(done) {
    expectRequest(requestedPath, expectedPath, "{}", filter);
    geoservices.get({
      host: "example.com",
      path: requestedPath
    });
    nock.cleanAll();
    return done();
  };
};

describe("geoservices", function() {
  return describe("get", function() {
    it("should request the specified URL", getUrlTest("/ArcGIS/rest/services", "/ArcGIS/rest/services"));
    it("should throw an error if no host", function() {
      return assert.throws(function() {
        return geoservices.get();
      });
    });
    it("should allow null path", getUrlTest(null, ""));
    it("should allow undefined path", getUrlTest(void 0, ""));
    it("should add json format parameter", getUrlTest("", "?f=json", false));
    it("should leave format parameter if present", getUrlTest("?f=pjson", "?f=pjson", false));
    it("should add params to querystring", function(done) {
      expectRequest("", "?param1=value1&f=json", "{}", false);
      geoservices.get({
        host: "example.com",
        params: {
          param1: "value1"
        }
      });
      nock.cleanAll();
      return done();
    });
    it("should parse and return response", function(done) {
      expectRequest("", "", '{ "success": true }');
      return geoservices.get({
        host: "example.com"
      }, function(result) {
        assert.deepEqual(result, {
          success: true
        });
        nock.cleanAll();
        return done();
      });
    });
    return it("should return an error object when response cannot be parsed", function(done) {
      expectRequest("", "", "<xml>this is not json</xml>");
      return geoservices.get({
        host: "example.com"
      }, function(result) {
        assert.deepEqual("Response body is not valid JSON", result.error);
        assert.deepEqual("<xml>this is not json</xml>", result.responseBody);
        nock.cleanAll();
        return done();
      });
    });
  });
});
