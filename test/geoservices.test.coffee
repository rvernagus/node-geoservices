geoservices = require "../"
assert = require "assert"
nock = require "nock"

expectRequest = (requestedPath, expectedPath, response, method, filter=true) ->
  req = nock "http://example.com"
  req = req.filteringPath(/\?.+$/, "") if filter
  m = req[method]
  m(expectedPath || "").reply(200, response)
  req

expectGetRequest = (requestedPath, expectedPath, response, filter=true) ->
  expectRequest requestedPath, expectedPath, response, "get", filter

expectPostRequest = (requestedPath, expectedPath, response, filter=true) ->
  expectRequest requestedPath, expectedPath, response, "post", filter
  

getUrlTest = (requestedPath, expectedPath, filter) ->
  (done) ->
    expectGetRequest requestedPath, expectedPath, "{}", filter
    geoservices.get { host: "example.com", path: requestedPath }, ->
      nock.cleanAll()
      done()

postUrlTest = (requestedPath, expectedPath, response="{}", filter) ->
  (done) ->
    expectPostRequest requestedPath, expectedPath, response, filter
    geoservices.post { host: "example.com", path: requestedPath }, ->
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

    it "should allow no callback", (done) ->
      expectGetRequest "", ""
      geoservices.get { host: "example.com" }
      nock.cleanAll()
      done()
      
    it "should return an error object when response cannot be parsed", (done) ->
      expectGetRequest "", "", "<xml>this is not json</xml>"
      
      geoservices.get { host: "example.com" }, (result) ->
        assert.deepEqual "Response body is not valid JSON", result.error
        assert.deepEqual "<xml>this is not json</xml>", result.responseBody
        nock.cleanAll()
        done()
        
        
  describe "post", ->
    it "should request the specified URL",
      postUrlTest "/ArcGIS/rest/services", "/ArcGIS/rest/services"
    
    it "should use method POST",
      postUrlTest "", ""
    
    it "should throw an error if no host", ->
      assert.throws -> geoservices.post()
  
    it "should allow null path",
      postUrlTest null, ""
    
    it "should allow undefined path",
      postUrlTest undefined, ""
    
    it "should add appropriate Content-Type header", (done) ->
      nock("http://example.com")
        .matchHeader("Content-Type", "application/x-www-form-urlencoded")
        .post("")
        .reply(200, "")
      geoservices.post { host: "example.com" }, ->
        nock.cleanAll()
        done()
    
    it "should serialize params object to body, adding json format param", (done) ->
      nock("http://example.com")
        .post("", "param1=value1&param2=value2&f=json")
        .reply(200, "")
      geoservices.post { host: "example.com", params: { param1: "value1", param2: "value2" }}, ->
        nock.cleanAll()
        done()
    
    it "should serialize params object array to body", (done) ->
      nock("http://example.com")
        .post("", 'param1=[{"param2":"value2","param3":"value3"}]&f=json')
        .reply(200, "")
      geoservices.post { host: "example.com", params: { param1: [{ param2: "value2", param3: "value3" }]}}, ->
        nock.cleanAll()
        done()
    
    it "should parse and return response", (done) ->
      expectPostRequest "", "", '{ "success": true }'
      geoservices.post { host: "example.com" }, (result) ->
        assert.deepEqual result, { success: true }
        nock.cleanAll()
        done()
    
    it "should allow no callback", (done) ->
      expectPostRequest "", ""
      geoservices.post { host: "example.com" }
      nock.cleanAll()
      done()
      
    it "should return an error object when response cannot be parsed", (done) ->
      expectPostRequest "", "", "<xml>this is not json</xml>"
      
      geoservices.post { host: "example.com" }, (result) ->
        assert.deepEqual "Response body is not valid JSON", result.error
        assert.deepEqual "<xml>this is not json</xml>", result.responseBody
        nock.cleanAll()
        done()
  
  describe "serializeBody", ->
    it "should use format key=val", ->
      result = geoservices.serializeBody { key: "val" }
      assert.equal result, "key=val"
    
    it "should support multiple keys", ->
      result = geoservices.serializeBody { key1: "val1", key2: "val2", key3: "val3" }
      assert.equal result, "key1=val1&key2=val2&key3=val3"
    
    it "should support deep objects", ->
      result = geoservices.serializeBody { key1: { key2: "val2" }}
      assert.equal result, 'key1={"key2":"val2"}'
    
    it "should support array values", ->
      result = geoservices.serializeBody { key: ["val1", "val2", 1]}
      assert.equal result, 'key=["val1","val2",1]'
    
    it "should support number values", ->
      result = geoservices.serializeBody { key: 1 }
      assert.equal result, "key=1"
    
    it "should support comma-separated values", ->
      result = geoservices.serializeBody { key: "1,2,3" }
      assert.equal result, "key=1,2,3"
  