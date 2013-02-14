var http = require('http');
var url = require('url');
var _ = require('underscore');
var GeoJSONConverter = require('./geo_json_converter');
var RequestParams = require('./request_params');

var removeQueryString = function(c, str) {
  var index = str.indexOf(c);
  if (index >= 0)
    return str.substring(0, index);
  else
    return str;
};

var asQueryString = function(obj) {
  var params = new RequestParams(obj);
  var query = url.format(params.toString());
  return '?' + query;
};

var addParamsToPath = function(options) {
  _.defaults(options, {path: '', params: {}});
  options.path = removeQueryString('?', options.path);
  options.params.f = 'json';
  options.path += asQueryString(options.params);
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
