var geoservices = require('../');

var options = {
  host: 'sampleserver5.arcgisonline.com',
  path: '/ArcGIS/rest/services/Notes/FeatureServer/0/updateFeatures',
  params: {
    features: [{
      attributes: {
        objectid: 250926, // This example requires a valid OBJECTID to work
        note: 'Created with the node.js geoservices wrapper',
        link: 'https://github.com/rvernagus/node-geoservices',
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