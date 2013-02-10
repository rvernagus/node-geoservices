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

    it('map service (root)', function(done) {
      var options = {
        host: 'sampleserver1.arcgisonline.com',
        path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
      };
      geoservices.get(options, function(result) {
        assert.equal(result.currentVersion, 10.01);
        assert.equal(result.layers.length, 3);
        assert.deepEqual(result.spatialReference, {wkid: 4326});
        assert.equal(result.units, 'esriDecimalDegrees');
        assert.equal(result.documentInfo.Title, 'USA_Data');
        done();
      });
    });

    it('map service export', function(done) {
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
        assert.equal(result.width, 800);
        assert.equal(result.height, 600);
        assert.deepEqual(result.extent.spatialReference, {wkid: 102004});
        done();
      });
    });

    it('map service identify', function(done) {
      var options = {
        host: 'sampleserver1.arcgisonline.com',
        path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/identify',
        params: {
          geometryType: 'esriGeometryPoint',
          geometry: {x: -120, y: 40},
          layers: 'all:2',
          tolerance: 10,
          mapExtent: '-119,38,-121,41',
          imageDisplay: '400,300,96',
          returnGeometry: true
        }
      };
      geoservices.get(options, function(result) {
        console.log(result);
        var geoJsonResult = geoservices.convert.toGeoJSON(result.results);
        console.log(geoJsonResult);
        done();
      });
    })
  });
});
