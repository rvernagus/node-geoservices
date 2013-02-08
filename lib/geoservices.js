var http = require('http');
var url = require('url');
var querystring = require('querystring');

var addParamsToPath = function(options) {
  var pathUrl = url.parse(options.path || '', true);
  options.params = options.params || {};
  options.params.f = 'json';
  pathUrl.query = options.params;
  options.path = url.format(pathUrl);
};

var serializeBody = function(body) {
  var result = '';
  for (var key in body) {
    var val = body[key] || '';
    if (typeof val === 'object') {
      val = JSON.stringify(val);
    } else {
      val = val.toString();
    }
    result += '&' + key + '=' + val;
  }
  return result.substring(1);
};

var GeoJSONConverter = (function() {
  function GeoJSONConverter() {}

  var getGeoJSONGeometry = function(esriFeature) {
    var g = esriFeature.geometry;
    if (g.x) {
      return {
        type: 'Point',
        coordinates: [g.x, g.y]
      };
    } else if (g.points) {
      return {
        type: 'MultiPoint',
        coordinates: g.points
      };
    } else if (g.paths) {
      if (g.paths.length === 1) {
        return {
          type: 'LineString',
          coordinates: g.paths
        };
      } else {
        return {
          type: 'MultiLineString',
          coordinates: g.paths
        };
      }
    } else if (g.rings) {
      return {
        type: 'Polygon',
        coordinates: g.rings
      };
    } else {
      throw new Error('Invalid geometry');
    }
  };

  var getGeoJSONFeature = function(esriFeature) {
    return {
      type: 'Feature',
      properties: esriFeature.attributes,
      geometry: getGeoJSONGeometry(esriFeature)
    };
  };

  GeoJSONConverter.prototype.toGeoJSON = function(esriIn) {
    if (esriIn.length) {
      var results = [];
      var len = esriIn.length;
      for (var i = 0; i < len; i++) {
        var f = getGeoJSONFeature(esriIn[i]);
        results.push(f);
      }
      return results;
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
    options = options || {};
    if (!options.host) {
      throw new Error('Must include host in options');
    }
    addParamsToPath(options);
    var req = http.request(options);
    req.on('response', function(res) {
      var result = '';
      res.on('data', function(data) {
        result += data;
      });
      res.on('end', function() {
        var resultAsJson = null;
        try {
          resultAsJson = JSON.parse(result);
        } catch (err) {
          resultAsJson = {
            error: 'Response body is not valid JSON',
            responseBody: result
          };
        }
        if (callback) {
          callback(resultAsJson);
        }
      });
    });
    req.end();
  },

  post: function(options, callback) {
    options = options || {};
    if (!options.host) {
      throw new Error('Must include host in options');
    }
    options.path = options.path || '';
    options.method = 'POST';
    options.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (options.params) {
      options.params.f = 'json';
    }
    var body = serializeBody(options.params);
    var req = http.request(options);
    req.on('response', function(res) {
      var result = '';
      res.on('data', function(data) {
        result += data;
      });
      res.on('end', function() {
        var resultAsJson = null;
        try {
          resultAsJson = JSON.parse(result);
        } catch (err) {
          resultAsJson = {
            error: 'Response body is not valid JSON',
            responseBody: result
          };
        }
        if (callback) {
          callback(resultAsJson);
        }
      });
    });
    req.end(body);
  }
};
