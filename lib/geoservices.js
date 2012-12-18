var http = require('http');

module.exports = {
  get: function(options) {
    options.path = options.path || '';
    options.path += '?f=json';
    var req = http.request(options);
    req.end();
  }
};