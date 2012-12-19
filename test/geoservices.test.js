var assert, geoservices, getTest, nock;

geoservices = require("../");

assert = require("assert");

nock = require("nock");

getTest = function(requestedPath, expectedPath, filter) {
  return function(beforeExit) {
    var req;
    if (filter == null) filter = true;
    req = nock("http://example.com");
    if (filter) req = req.filteringPath(/\?.+$/, "");
    req.get(expectedPath || "").reply();
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
  "get requests the specified URL": getTest("/ArcGIS/rest/services", "/ArcGIS/rest/services", true),
  "get allows null path": getTest(null, "", true),
  "get allows undefined path": getTest(void 0, "", true),
  "get adds json format parameter": getTest("", "?f=json", false),
  "leaves format parameter if present": getTest("?f=pson", "?f=pson", false)
};
