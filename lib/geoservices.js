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
  get: function(options) {
    var req;
    options.path = addJsonFormatParam(options.path);
    req = http.request(options);
    return req.end();
  }
};
