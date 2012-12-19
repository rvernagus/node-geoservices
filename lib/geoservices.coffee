http = require "http"
url = require "url"

addJsonFormatParam = (path) ->
  pathUrl = url.parse(path || "", true)
  pathUrl.query.f = "json"
  url.format pathUrl

module.exports =
  get: (options) ->
    options.path = addJsonFormatParam options.path
    
    req = http.request options
    req.end()
