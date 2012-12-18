var http = require('http');
var url = require('url');

function addJsonFormatParam(path) {
  var pathUrl = url.parse(path || '', true);
  pathUrl.query.f = 'json';
  return url.format(pathUrl);
}

module.exports = {
  get: function(options) {
    options.path = addJsonFormatParam(options.path);
    
    var req = http.request(options);
    req.end();
  }
};