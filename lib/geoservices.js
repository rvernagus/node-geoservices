var http = require('http');

module.exports = {
  get: function(options) {
    var req = http.request(options);
    req.end();
  }
};