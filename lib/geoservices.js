var http = require('http');
var url = require('url');
var _ = require('underscore');
var GeoJSONConverter = require('./geo_json_converter');
var RequestParams = require('./request_params');


var addParamsToPath = function(options) {
  options.path = options.path || '';
  var index = options.path.indexOf('?');
  if (index >= 0)
    options.path = options.path.substring(0, index);
  options.params = options.params || {};
  options.params.f = 'json';
  var params = new RequestParams(options.params);
  // var query = serializeObject(options.params);
  options.path += '?' + url.format(params.toString());
};

module.exports = {
  RequestParams: RequestParams,

  convert: new GeoJSONConverter(),

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
    var params = new RequestParams(options.params);
    var body = params.toString();
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
