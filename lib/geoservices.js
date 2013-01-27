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
  var getGeoJSONGeometry;

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
        type: "Multipoint",
        coordinates: g.points
      };
    } else if (g.paths != null) {
      return {
        type: "LineString",
        coordinates: g.paths
      };
    }
  };

  GeoJSONConverter.prototype.toGeoJSON = function(esriFeature) {
    return {
      type: "Feature",
      properties: esriFeature.attributes,
      geometry: getGeoJSONGeometry(esriFeature)
    };
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
