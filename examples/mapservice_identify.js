var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/identify',
  params: {
    geometryType: 'esriGeometryPoint',
    geometry: '-120,40',
    tolerance: 10,
    mapExtent: '-119,38,-121,41',
    imageDisplay: '400,300,96',
    returnGeometry: true
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});
