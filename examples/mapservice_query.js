var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/1/query',
  params: {
    where: 'UPPER(STATE_NAME)=UPPER(\'colorado\')'
  }
};

geoservices.get(options, function(result) {
  console.log('Found: ' + result.features[0].attributes.STATE_NAME);
});

options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/1/query',
  params: {
    geometry: "-125.4,35.2,-118.7,43.8",
    geometryType: "esriGeometryEnvelope",
    where: "POP1999>5000000"
  }
};

geoservices.get(options, function(result) {
  console.log('Found: ' + result.features[0].attributes.STATE_NAME);
});
