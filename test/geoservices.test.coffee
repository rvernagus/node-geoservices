geoservices = require "../"
assert = require "assert"
nock = require "nock"

getTest = (requestedPath, expectedPath, filter) ->
  (beforeExit) ->
    filter ?= true
    
    req = nock "http://example.com"
    req = req.filteringPath(/\?.+$/, "") if filter
    req.get(expectedPath || "").reply()
    
    geoservices.get({ host: "example.com", path: requestedPath })
    
    beforeExit ->
      req.done()
      nock.cleanAll()

module.exports =
  "get requests the specified URL": getTest("/ArcGIS/rest/services", "/ArcGIS/rest/services", true),
  
  "get allows null path": getTest(null, "", true),
  
  "get allows undefined path": getTest(undefined, "", true),
  
  "get adds json format parameter": getTest("", "?f=json", false),
  
  "leaves format parameter if present": getTest("?f=pson", "?f=pson", false)
