var geoservices = require('../');
var assert = require('assert');

describe('geoservices converter', function() {
  describe('when converting from ESRI', function() {
    before(function() {
      this.esriFeature = {
        attributes: {
          attr1: 'val1'
        }
      };
    });

    it('should error upon empty geometry', function() {
      this.esriFeature.geometry = {};
      assert.throws((function() {
        geoservices.convert.toGeoJSON(this.esriFeature);
      }), Error);
    });

    it('should convert a point', function() {
      this.esriFeature.geometry = {
        x: 1,
        y: 2
      };
      var result = geoservices.convert.toGeoJSON(this.esriFeature);
      var expected = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [1, 2]
        },
        properties: {
          attr1: 'val1'
        }
      };
      assert.deepEqual(result, expected);
    });

    it('should convert an array of points', function() {
      this.esriFeature.geometry = {
        x: 1,
        y: 2
      };
      var esriFeatures = [this.esriFeature, this.esriFeature];
      var result = geoservices.convert.toGeoJSON(esriFeatures);
      assert.equal(2, result.length);
      assert.equal('Point', result[0].geometry.type);
    });

    it('should convert a multipoint', function() {
      this.esriFeature.geometry = {
        points: [[1, 2], [3, 4]]
      };
      var result = geoservices.convert.toGeoJSON(this.esriFeature);
      var expected = {
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates: [[1, 2], [3, 4]]
        },
        properties: {
          attr1: 'val1'
        }
      };
      assert.deepEqual(result, expected);
    });

    it('should convert an array of multipoints', function() {
      this.esriFeature.geometry = {
        points: [[1, 2], [3, 4]]
      };
      var esriFeatures = [this.esriFeature, this.esriFeature];
      var result = geoservices.convert.toGeoJSON(esriFeatures);
      assert.equal(2, result.length);
      assert.equal('MultiPoint', result[0].geometry.type);
    });

    it('should convert a one-path polyline', function() {
      this.esriFeature.geometry = {
        paths: [[[1, 2], [3, 4]]]
      };
      var result = geoservices.convert.toGeoJSON(this.esriFeature);
      var expected = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[[1, 2], [3, 4]]]
        },
        properties: {
          attr1: 'val1'
        }
      };
      assert.deepEqual(result, expected);
    });

    it('should convert an array of one-path polylines', function() {
      this.esriFeature.geometry = {
        paths: [[[1, 2], [3, 4]]]
      };
      var esriFeatures = [this.esriFeature, this.esriFeature];
      var result = geoservices.convert.toGeoJSON(esriFeatures);
      assert.equal(2, result.length);
      assert.equal('LineString', result[0].geometry.type);
    });

    it('should convert a two-path polyline', function() {
      this.esriFeature.geometry = {
        paths: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
      };
      var result = geoservices.convert.toGeoJSON(this.esriFeature);
      var expected = {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
        },
        properties: {
          attr1: 'val1'
        }
      };
      assert.deepEqual(result, expected);
    });

    it('should convert an array of two-path polylines', function() {
      this.esriFeature.geometry = {
        paths: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
      };
      var esriFeatures = [this.esriFeature, this.esriFeature];
      var result = geoservices.convert.toGeoJSON(esriFeatures);
      assert.equal(2, result.length);
      assert.equal('MultiLineString', result[0].geometry.type);
    });

    it('should convert a single ring polygon', function() {
      this.esriFeature.geometry = {
        rings: [[[1, 2], [3, 4]], [[5, 6], [1, 2]]]
      };
      var result = geoservices.convert.toGeoJSON(this.esriFeature);
      var expected = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[1, 2], [3, 4]], [[5, 6], [1, 2]]]
        },
        properties: {
          attr1: 'val1'
        }
      };
      assert.deepEqual(result, expected);
    });

    it('should convert an array of single ring polygons', function() {
      this.esriFeature.geometry = {
        rings: [[[1, 2], [3, 4]], [[5, 6], [1, 2]]]
      };
      var esriFeatures = [this.esriFeature, this.esriFeature];
      var result = geoservices.convert.toGeoJSON(esriFeatures);
      assert.equal(2, result.length);
      assert.equal('Polygon', result[0].geometry.type);
    });

    it('should convert a two ring polygon', function() {
      this.esriFeature.geometry = {
        rings: [[[1, 2], [3, 4]], [[5, 6], [1, 2]], [[7, 8], [9, 10]], [[11, 12], [7, 8]]]
      };
      var result = geoservices.convert.toGeoJSON(this.esriFeature);
      var expected = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[1, 2], [3, 4]], [[5, 6], [1, 2]], [[7, 8], [9, 10]], [[11, 12], [7, 8]]]
        },
        properties: {
          attr1: 'val1'
        }
      };
      assert.deepEqual(result, expected);
    });

    it('should convert an array of two ring polygons', function() {
      this.esriFeature.geometry = {
        rings: [[[1, 2], [3, 4]], [[5, 6], [1, 2]], [[7, 8], [9, 10]], [[11, 12], [7, 8]]]
      };
      var esriFeatures = [this.esriFeature, this.esriFeature];
      var result = geoservices.convert.toGeoJSON(esriFeatures);
      assert.equal(2, result.length);
      assert.equal('Polygon', result[0].geometry.type);
    });
  });
});
