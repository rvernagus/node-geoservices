var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/find',
  params: {
    searchText: 'island',
    contains: true,
    layers: '0,2',
    returnGeometry: true
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});
