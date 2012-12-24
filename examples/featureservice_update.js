var geoservices = require('../');

var options = {
  host: 'sampleserver5.arcgisonline.com',
  path: '/ArcGIS/rest/services/Notes/FeatureServer/0/updateFeatures',
  params: {
    features: [{
      attributes: {
        objectid: 250529, // This example requires a valid OBJECTID to work
        note: 'Node.js was here =) (UPDATED)',
        link: '',
        name: 'tester2'
      },
      geometry: {
        x: -117,
        y: 34
      }
    }]
  }
};

geoservices.post(options, function(result) {
  console.log(result);
});