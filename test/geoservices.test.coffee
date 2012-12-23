geoservices = require "../"
assert = require "assert"
nock = require "nock"

expectGetRequest = (requestedPath, expectedPath, response, filter=true) ->
  req = nock "http://example.com"
  req = req.filteringPath(/\?.+$/, "") if filter
  req.get(expectedPath || "").reply(200, response)
  req

getUrlTest = (requestedPath, expectedPath, filter) ->
  (done) ->
    expectGetRequest requestedPath, expectedPath, "{}", filter
    geoservices.get { host: "example.com", path: requestedPath }, ->
      nock.cleanAll()
      done()

describe "geoservices", ->
  describe "get", ->
    it "should request the specified URL",
      getUrlTest "/ArcGIS/rest/services", "/ArcGIS/rest/services"
    
    it "should use method GET", ->
      getUrlTest "", ""
    
    it "should throw an error if no host", ->
      assert.throws -> geoservices.get()

    it "should allow null path",
      getUrlTest null, ""
    
    it "should allow undefined path",
      getUrlTest undefined, ""
  
    it "should add json format parameter",
      getUrlTest "", "?f=json", false
  
    it "should leave format parameter if present",
      getUrlTest "?f=pjson", "?f=pjson", false
    
    it "should add params to querystring", (done) ->
      expectGetRequest "", "?param1=value1&f=json", "{}", false
      geoservices.get { host: "example.com", params: { param1: "value1" }}, ->
        nock.cleanAll()
        done()
        
    it "should parse and return response", (done) ->
      expectGetRequest "", "", '{ "success": true }'
      geoservices.get { host: "example.com" }, (result) ->
        assert.deepEqual result, { success: true }
        nock.cleanAll()
        done()
      
    it "should return an error object when response cannot be parsed", (done) ->
      expectGetRequest "", "", "<xml>this is not json</xml>"
      
      geoservices.get { host: "example.com" }, (result) ->
        assert.deepEqual "Response body is not valid JSON", result.error
        assert.deepEqual "<xml>this is not json</xml>", result.responseBody
        nock.cleanAll()
        done()
