var geoservices = require('../');
var assert = require('assert');


describe('geoservices', function() {
  describe('get', function() {
    it('catalog (root)', function(done) {
      var options = {
        host: 'sampleserver1.arcgisonline.com',
        path: '/ArcGIS/rest/services'
      };

      geoservices.get(options, function(result) {
        assert.deepEqual(result, {
          currentVersion: 10.01,
          folders: ['Demographics','Elevation','Locators','Louisville','Network','Petroleum','PublicSafety','Specialty', 'TaxParcel', 'WaterTemplate'],
          services: [{name : 'Geometry', type: 'GeometryServer'}]
        });
        done();
      });
    });
  });
});
