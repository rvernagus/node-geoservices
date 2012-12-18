var http = require('http');
var url = require('url');

module.exports = {
  get: function(options) {
    var path = url.parse(options.path || '', true);
    path.query.f = 'json';
    options.path = url.format(path);
    
    var req = http.request(options);
    req.end();
  }
};