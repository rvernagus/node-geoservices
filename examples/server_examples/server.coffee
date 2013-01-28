express = require "express"
http = require "http"
geoservices = require "../../"

app = express()

app.configure ->
  app.set "port", process.env.PORT || 3000
  app.use express.static("public")
  app.use express.bodyParser()

app.get "/census_points", (req, res) ->
  options =
    host: "sampleserver1.arcgisonline.com"
    path: "/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/0/query"
    params:
      outFields: "POP2000"
      geometry: "-85,42,-84,41"
      geometryType: "esriGeometryEnvelope"

  geoservices.get options, (esriFeatures) ->
    result = geoservices.convert.toGeoJSON esriFeatures.features
    res.end JSON.stringify(result)

http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")
