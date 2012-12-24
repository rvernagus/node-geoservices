var assert, expectGetRequest, expectPostRequest, expectRequest, geoservices, getUrlTest, nock, postUrlTest;

geoservices = require("../");

assert = require("assert");

nock = require("nock");

expectRequest = function(requestedPath, expectedPath, response, method, filter) {
  var m, req;
  if (filter == null) filter = true;
  req = nock("http://example.com");
  if (filter) req = req.filteringPath(/\?.+$/, "");
  m = req[method];
  m(expectedPath || "").reply(200, response);
  return req;
};

expectGetRequest = function(requestedPath, expectedPath, response, filter) {
  if (filter == null) filter = true;
  return expectRequest(requestedPath, expectedPath, response, "get", filter);
};

expectPostRequest = function(requestedPath, expectedPath, response, filter) {
  if (filter == null) filter = true;
  return expectRequest(requestedPath, expectedPath, response, "post", filter);
};

getUrlTest = function(requestedPath, expectedPath, filter) {
  return function(done) {
    expectGetRequest(requestedPath, expectedPath, "{}", filter);
    return geoservices.get({
      host: "example.com",
      path: requestedPath
    }, function() {
      nock.cleanAll();
      return done();
    });
  };
};

postUrlTest = function(requestedPath, expectedPath, response, filter) {
  if (response == null) response = "{}";
  return function(done) {
    expectPostRequest(requestedPath, expectedPath, response, filter);
    return geoservices.post({
      host: "example.com",
      path: requestedPath
    }, function() {
      nock.cleanAll();
      return done();
    });
  };
};

describe("geoservices", function() {
  describe("get", function() {
    it("should request the specified URL", getUrlTest("/ArcGIS/rest/services", "/ArcGIS/rest/services"));
    it("should use method GET", function() {
      return getUrlTest("", "");
    });
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
      expectGetRequest("", "?param1=value1&f=json", "{}", false);
      return geoservices.get({
        host: "example.com",
        params: {
          param1: "value1"
        }
      }, function() {
        nock.cleanAll();
        return done();
      });
    });
    it("should parse and return response", function(done) {
      expectGetRequest("", "", '{ "success": true }');
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
    it("should allow no callback", function(done) {
      expectGetRequest("", "");
      geoservices.get({
        host: "example.com"
      });
      nock.cleanAll();
      return done();
    });
    return it("should return an error object when response cannot be parsed", function(done) {
      expectGetRequest("", "", "<xml>this is not json</xml>");
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
  describe("post", function() {
    it("should request the specified URL", postUrlTest("/ArcGIS/rest/services", "/ArcGIS/rest/services"));
    it("should use method POST", postUrlTest("", ""));
    it("should throw an error if no host", function() {
      return assert.throws(function() {
        return geoservices.post();
      });
    });
    it("should allow null path", postUrlTest(null, ""));
    it("should allow undefined path", postUrlTest(void 0, ""));
    it("should add appropriate Content-Type header", function(done) {
      nock("http://example.com").matchHeader("Content-Type", "application/x-www-form-urlencoded").post("").reply(200, "");
      return geoservices.post({
        host: "example.com"
      }, function() {
        nock.cleanAll();
        return done();
      });
    });
    it("should serialize params object to body, adding json format param", function(done) {
      nock("http://example.com").post("", "param1=value1&param2=value2&f=json").reply(200, "");
      return geoservices.post({
        host: "example.com",
        params: {
          param1: "value1",
          param2: "value2"
        }
      }, function() {
        nock.cleanAll();
        return done();
      });
    });
    it("should serialize params object array to body", function(done) {
      nock("http://example.com").post("", 'param1=[{"param2":"value2","param3":"value3"}]&f=json').reply(200, "");
      return geoservices.post({
        host: "example.com",
        params: {
          param1: [
            {
              param2: "value2",
              param3: "value3"
            }
          ]
        }
      }, function() {
        nock.cleanAll();
        return done();
      });
    });
    it("should parse and return response", function(done) {
      expectPostRequest("", "", '{ "success": true }');
      return geoservices.post({
        host: "example.com"
      }, function(result) {
        assert.deepEqual(result, {
          success: true
        });
        nock.cleanAll();
        return done();
      });
    });
    it("should allow no callback", function(done) {
      expectPostRequest("", "");
      geoservices.post({
        host: "example.com"
      });
      nock.cleanAll();
      return done();
    });
    return it("should return an error object when response cannot be parsed", function(done) {
      expectPostRequest("", "", "<xml>this is not json</xml>");
      return geoservices.post({
        host: "example.com"
      }, function(result) {
        assert.deepEqual("Response body is not valid JSON", result.error);
        assert.deepEqual("<xml>this is not json</xml>", result.responseBody);
        nock.cleanAll();
        return done();
      });
    });
  });
  return describe("serializeBody", function() {
    it("should use format key=val", function() {
      var result;
      result = geoservices.serializeBody({
        key: "val"
      });
      return assert.equal(result, "key=val");
    });
    it("should support multiple keys", function() {
      var result;
      result = geoservices.serializeBody({
        key1: "val1",
        key2: "val2",
        key3: "val3"
      });
      return assert.equal(result, "key1=val1&key2=val2&key3=val3");
    });
    it("should support deep objects", function() {
      var result;
      result = geoservices.serializeBody({
        key1: {
          key2: "val2"
        }
      });
      return assert.equal(result, 'key1={"key2":"val2"}');
    });
    it("should support array values", function() {
      var result;
      result = geoservices.serializeBody({
        key: ["val1", "val2", 1]
      });
      return assert.equal(result, 'key=["val1","val2",1]');
    });
    it("should support number values", function() {
      var result;
      result = geoservices.serializeBody({
        key: 1
      });
      return assert.equal(result, "key=1");
    });
    return it("should support comma-separated values", function() {
      var result;
      result = geoservices.serializeBody({
        key: "1,2,3"
      });
      return assert.equal(result, "key=1,2,3");
    });
  });
});
