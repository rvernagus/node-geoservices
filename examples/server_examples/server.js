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
      outFields: "POP2000",
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

app.get("/census_polys", function(req, res) {
  var options;
  options = {
    host: "sampleserver1.arcgisonline.com",
    path: "/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/1/query",
    params: {
      outFields: "POP2000",
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

app.get("/outage_polys", function(req, res) {
  var options;
  options = {
    host: "www.consumersenergy.com",
    path: "/svcs/ArcGIS/rest/services/CEOutageMap/MapServer/4/query",
    params: {
      where: "1=1",
      outFields: "PCT_CUSTOMERS_OUT,OUTAGE_COUNT",
      outSR: 4326
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
