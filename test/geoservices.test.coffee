geoservices = require "../"
assert = require "assert"
nock = require "nock"

expectRequest = (requestedPath, expectedPath, response, filter) ->
  filter ?= true
    
  req = nock "http://example.com"
  req = req.filteringPath(/\?.+$/, "") if filter
  req.get(expectedPath || "").reply(200, response)
  req

getUrlTest = (requestedPath, expectedPath, filter) ->
  (beforeExit) ->
    req = expectRequest requestedPath, expectedPath, "{}", filter
    
    geoservices.get { host: "example.com", path: requestedPath }, () ->
    
    beforeExit ->
      req.done()
      nock.cleanAll()


module.exports =
  "get requests the specified URL":
    getUrlTest "/ArcGIS/rest/services", "/ArcGIS/rest/services", true
  
  "get allows null path":
    getUrlTest null, "", true
  
  "get allows undefined path":
    getUrlTest undefined, "", true
  
  "get adds json format parameter":
    getUrlTest "", "?f=json", false
  
  "get leaves format parameter if present":
    getUrlTest "?f=pson", "?f=pson", false
    
  "get parses and returns response": (beforeExit) ->
    req = expectRequest "", "", '{ "success": true }', true
    geoservices.get host: "example.com", path: "", (result) ->
      assert.eql result, { success: true }
    