var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Geometry/GeometryServer/buffer',
  params: {
    inSR: 4326,
    outSR: 4326,
    bufferSR: 102113,
    distances: 1000,
    geometries: '-117,34'
  }
};

geoservices.post(options, function(result) {
  console.log(result);
  
  console.log('points in ring:');
  var rings = result.geometries[0].rings[0];
  for (var i in rings) {
    console.log(' x: ' + rings[i][0] + ', y: ' + rings[i][1]);
  }
});
