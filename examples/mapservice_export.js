var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/export',
  params: {
    bbox: '-115.8,30.4,-85.5,50.5',
    size: '800,600',
    imageSR: 102004,
    format: 'gif',
    transparent: false
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});
