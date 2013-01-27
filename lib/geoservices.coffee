http = require "http"
url = require "url"
querystring = require "querystring"


addParamsToPath = (options) ->
  pathUrl = url.parse(options.path || "", true)
  options.params ?= {}
  options.params.f = "json"
  pathUrl.query = options.params
  options.path = url.format pathUrl
  
serializeBody = (body) ->
  result = ""
  for key of body
    val = body[key] || ""
    if typeof val == "object"
      stringifiedVal = JSON.stringify val
    else
      stringifiedVal = val.toString()
    result += "&#{key}=#{stringifiedVal}"
  result.substring 1

class GeoJSONConverter
  getGeoJSONGeometry = (esriFeature) ->
    g = esriFeature.geometry
    if g.x?
      type: "Point"
      coordinates: [g.x, g.y]
    else if g.points?
      type: "Multipoint"
      coordinates: g.points
    else if g.paths?
      if g.paths.length == 1
        type: "LineString"
        coordinates: g.paths
      else
        type: "MultiLineString"
        coordinates: g.paths

  toGeoJSON: (esriFeature) ->
    type: "Feature"
    properties: esriFeature.attributes
    geometry: getGeoJSONGeometry esriFeature

module.exports =
  convert: new GeoJSONConverter()

  serializeBody: serializeBody

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
    body = serializeBody options.params

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