var geoservices = require('../');

var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer/findAddressCandidates',
  params: {
    Address: '4500 Renaissance Center',
    City: 'Detroit',
    State: 'MI',
    Zip: '48243',
    outFields: '*'
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});