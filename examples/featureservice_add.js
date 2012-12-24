var geoservices = require('../');

var options = {
  host: 'sampleserver5.arcgisonline.com',
  path: '/ArcGIS/rest/services/Notes/FeatureServer/0/addFeatures',
  params: {
    features: [{
      attributes: {
        note: 'Node.js was here =)',
        link: '',
        name: 'tester'
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