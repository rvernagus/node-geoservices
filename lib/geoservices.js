var addParamsToPath, http, querystring, url;

http = require("http");

url = require("url");

querystring = require("querystring");

addParamsToPath = function(options) {
  var pathUrl;
  pathUrl = url.parse(options.path || "", true);
  if (options.params == null) options.params = {};
  options.params.f = "json";
  pathUrl.query = options.params;
  return options.path = url.format(pathUrl);
};

module.exports = {
  get: function(options, callback) {
    var req;
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
        if (callback) return callback(resultAsJson);
      });
    });
    return req.end();
  }
};
