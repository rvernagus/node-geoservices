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
    
    geoservices.get { host: "example.com", path: requestedPath }
    
    beforeExit ->
      req.done()
      nock.cleanAll()


module.exports =
  "get requests the specified URL":
    getUrlTest "/ArcGIS/rest/services", "/ArcGIS/rest/services"
  
  "get throws error if no host":
    assert.throws -> geoservices.get()
  
  "get allows null path":
    getUrlTest null, ""
  
  "get allows undefined path":
    getUrlTest undefined, ""
  
  "get adds json format parameter":
    getUrlTest "", "?f=json", false
  
  "get leaves format parameter if present":
    getUrlTest "?f=pson", "?f=pson", false
    
  "get adds params to querystring": (beforeExit) ->
    req = expectRequest "", "?param1=value1&f=json", "{}", false
    geoservices.get { host: "example.com", params: { param1: "value1" }}
    
    beforeExit ->
      req.done()
      nock.cleanAll()
      
  "get parses and returns response": (beforeExit) ->
    req = expectRequest "", "", '{ "success": true }'
    geoservices.get { host: "example.com" }, (result) ->
      assert.eql result, { success: true }
  
    beforeExit ->
      req.done()
      nock.cleanAll()
      
  "get returns an error object when response cannot be parsed": (beforeExit) ->
    req = expectRequest "", "", "<xml>this is not json</xml>"
    
    geoservices.get { host: "example.com" }, (result) ->
      assert.isDefined result.error
      assert.isDefined result.responseBody
      assert.eql "Response body is not valid JSON", result.error
      assert.eql "<xml>this is not json</xml>", result.responseBody
    
    beforeExit ->
      req.done()
      nock.cleanAll()