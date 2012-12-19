http = require "http"
url = require "url"

addJsonFormatParam = (path) ->
  pathUrl = url.parse(path || "", true)
  pathUrl.query.f = "json"
  url.format pathUrl

module.exports =
  get: (options, callback) ->
    options.path = addJsonFormatParam options.path
    
    req = http.request options
    req.on "response", (res) ->
      result = ""
      res.on "data", (data) ->
        result += data
        
      res.on "end", () ->
        try
          resultAsJson = JSON.parse result
          callback resultAsJson
        catch err
          throw new Error(err.toString())
    
    req.end()
