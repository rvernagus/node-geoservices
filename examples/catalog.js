var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services'
};

geoservices.get(options, function(result) {
  console.log(result);
});
