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
  get: (options, callback) ->
    addParamsToPath options
    
    req = http.request options
    req.on "response", (res) ->
      result = ""
      res.on "data", (data) ->
        result += data
        
      res.on "end", () ->
        try
          resultAsJson = JSON.parse result
          callback resultAsJson if callback
        catch err
          throw err
    
    req.end()
