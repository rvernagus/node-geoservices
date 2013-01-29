var GeoJSONConverter, addParamsToPath, http, querystring, serializeBody, url;

http = require("http");

url = require("url");

querystring = require("querystring");

addParamsToPath = function(options) {
  var pathUrl, _ref;
  pathUrl = url.parse(options.path || "", true);
  if ((_ref = options.params) == null) {
    options.params = {};
  }
  options.params.f = "json";
  pathUrl.query = options.params;
  return options.path = url.format(pathUrl);
};

serializeBody = function(body) {
  var key, result, stringifiedVal, val;
  result = "";
  for (key in body) {
    val = body[key] || "";
    if (typeof val === "object") {
      stringifiedVal = JSON.stringify(val);
    } else {
      stringifiedVal = val.toString();
    }
    result += "&" + key + "=" + stringifiedVal;
  }
  return result.substring(1);
};

GeoJSONConverter = (function() {
  var getGeoJSONFeature, getGeoJSONGeometry;

  function GeoJSONConverter() {}

  getGeoJSONGeometry = function(esriFeature) {
    var g;
    g = esriFeature.geometry;
    if (g.x != null) {
      return {
        type: "Point",
        coordinates: [g.x, g.y]
      };
    } else if (g.points != null) {
      return {
        type: "MultiPoint",
        coordinates: g.points
      };
    } else if (g.paths != null) {
      if (g.paths.length === 1) {
        return {
          type: "LineString",
          coordinates: g.paths
        };
      } else {
        return {
          type: "MultiLineString",
          coordinates: g.paths
        };
      }
    } else if (g.rings != null) {
      return {
        type: "Polygon",
        coordinates: g.rings
      };
    } else {
      throw new Error("Invalid geometry");
    }
  };

  getGeoJSONFeature = function(esriFeature) {
    return {
      type: "Feature",
      properties: esriFeature.attributes,
      geometry: getGeoJSONGeometry(esriFeature)
    };
  };

  GeoJSONConverter.prototype.toGeoJSON = function(esriIn) {
    var f, _i, _len, _results;
    if (esriIn.length != null) {
      _results = [];
      for (_i = 0, _len = esriIn.length; _i < _len; _i++) {
        f = esriIn[_i];
        _results.push(getGeoJSONFeature(f));
      }
      return _results;
    } else {
      return getGeoJSONFeature(esriIn);
    }
  };

  return GeoJSONConverter;

})();

module.exports = {
  convert: new GeoJSONConverter(),
  serializeBody: serializeBody,
  get: function(options, callback) {
    var req;
    if (options == null) {
      options = {};
    }
    if (options.host == null) {
      throw new Error("Must include host in options");
    }
    addParamsToPath(options);
    req = http.request(options);
    req.on("response", function(res) {
      var result;
      result = "";
      res.on("data", function(data) {
        return result += data;
      });
      return res.on("end", function() {
        var resultAsJson;
        resultAsJson = null;
        try {
          resultAsJson = JSON.parse(result);
        } catch (err) {
          resultAsJson = {
            error: "Response body is not valid JSON",
            responseBody: result
          };
        }
        if (callback) {
          return callback(resultAsJson);
        }
      });
    });
    return req.end();
  },
  post: function(options, callback) {
    var body, req;
    if (options == null) {
      options = {};
    }
    if (options.host == null) {
      throw new Error("Must include host in options");
    }
    options.path || (options.path = "");
    options.method = "POST";
    options.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    if (options.params) {
      options.params.f = "json";
    }
    body = serializeBody(options.params);
    req = http.request(options);
    req.on("response", function(res) {
      var result;
      result = "";
      res.on("data", function(data) {
        return result += data;
      });
      return res.on("end", function() {
        var resultAsJson;
        resultAsJson = null;
        try {
          resultAsJson = JSON.parse(result);
        } catch (err) {
          resultAsJson = {
            error: "Response body is not valid JSON",
            responseBody: result
          };
        }
        if (callback) {
          return callback(resultAsJson);
        }
      });
    });
    return req.end(body);
  }
};
