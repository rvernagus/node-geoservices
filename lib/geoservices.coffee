http = require "http"
url = require "url"
querystring = require "querystring"


addParamsToPath = (options) ->
  pathUrl = url.parse(options.path || "", true)
  options.params ?= {}
  options.params.f = "json"
  pathUrl.query = options.params
  options.path = url.format pathUrl

module.exports =
  serializeBody: (body) ->
    result = ""
    for key of body
      if typeof body[key] == "object"
        stringifiedBody = JSON.stringify body[key]
      else
        stringifiedBody = body[key].toString()
      result += "&#{key}=#{stringifiedBody}"
    result.substring 1
    
  get: (options={}, callback) ->
    throw new Error("Must include host in options") unless options.host?
  
    addParamsToPath options
    
    req = http.request options
    req.on "response", (res) ->
      result = ""
      res.on "data", (data) ->
        result += data
        
      res.on "end", ->
        resultAsJson = null
        try
          resultAsJson = JSON.parse result
        catch err
          resultAsJson =
            error: "Response body is not valid JSON"
            responseBody: result
          
        callback resultAsJson if callback
    req.end()
  
  post: (options={}, callback) ->
    throw new Error("Must include host in options") unless options.host?
  
    options.path ||= ""
    options.method = "POST"
    options.headers = { "Content-Type": "application/x-www-form-urlencoded" }
    options.params.f = "json" if options.params
    body = @serializeBody options.params

    req = http.request options
    req.on "response", (res) ->
      result = ""
      res.on "data", (data) ->
        result += data
        
      res.on "end", ->
        resultAsJson = null
        try
          resultAsJson = JSON.parse result
        catch err
          resultAsJson =
            error: "Response body is not valid JSON"
            responseBody: result
          
        callback resultAsJson if callback
        
    req.end body