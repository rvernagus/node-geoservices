var app, express, geoservices, http;

express = require("express");

http = require("http");

geoservices = require("../../");

app = express();

app.configure(function() {
  app.set("port", process.env.PORT || 3000);
  app.use(express["static"]("public"));
  return app.use(express.bodyParser());
});

app.get("/census_points", function(req, res) {
  var options;
  options = {
    host: "sampleserver1.arcgisonline.com",
    path: "/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/0/query",
    params: {
      geometry: "-85,42,-84,41",
      geometryType: "esriGeometryEnvelope"
    }
  };
  return geoservices.get(options, function(esriFeatures) {
    var result;
    result = geoservices.convert.toGeoJSON(esriFeatures.features);
    return res.end(JSON.stringify(result));
  });
});

http.createServer(app).listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});
