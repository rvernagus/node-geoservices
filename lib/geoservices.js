var addJsonFormatParam, http, url;

http = require("http");

url = require("url");

addJsonFormatParam = function(path) {
  var pathUrl;
  pathUrl = url.parse(path || "", true);
  pathUrl.query.f = "json";
  return url.format(pathUrl);
};

module.exports = {
  get: function(options, callback) {
    var req;
    options.path = addJsonFormatParam(options.path);
    req = http.request(options);
    req.on("response", function(res) {
      var result;
      result = "";
      res.on("data", function(data) {
        return result += data;
      });
      return res.on("end", function() {
        var resultAsJson;
        try {
          resultAsJson = JSON.parse(result);
          return callback(resultAsJson);
        } catch (err) {
          throw new Error(err.toString());
        }
      });
    });
    return req.end();
  }
};
