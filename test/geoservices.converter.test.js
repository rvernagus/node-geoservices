var assert, geoservices;

geoservices = require("../");

assert = require("assert");

describe("geoservices converter", function() {
  return describe("when converting from ESRI", function() {
    before(function() {
      return this.esriFeature = {
        attributes: {
          attr1: "val1"
        }
      };
    });
    it("should convert a point", function() {
      var expected, result;
      this.esriFeature.geometry = {
        x: 1,
        y: 2
      };
      result = geoservices.convert.toGeoJSON(this.esriFeature);
      expected = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [1, 2]
        },
        properties: {
          attr1: "val1"
        }
      };
      return assert.deepEqual(result, expected);
    });
    it("should error upon empty point", function() {
      this.esriFeature.geometry = {};
      return assert.throws((function() {
        return geoservices.convert.toGeoJSON(this.esriFeature);
      }), Error);
    });
    it("should convert an array of points", function() {
      var esriFeatures, result;
      this.esriFeature.geometry = {
        x: 1,
        y: 2
      };
      esriFeatures = [this.esriFeature, this.esriFeature];
      result = geoservices.convert.toGeoJSON(esriFeatures);
      return assert.equal(2, result.length);
    });
    it("should convert a multipoint", function() {
      var expected, result;
      this.esriFeature.geometry = {
        points: [[1, 2], [3, 4]]
      };
      result = geoservices.convert.toGeoJSON(this.esriFeature);
      expected = {
        type: "Feature",
        geometry: {
          type: "Multipoint",
          coordinates: [[1, 2], [3, 4]]
        },
        properties: {
          attr1: "val1"
        }
      };
      return assert.deepEqual(result, expected);
    });
    it("should convert a one path polyline", function() {
      var expected, result;
      this.esriFeature.geometry = {
        paths: [[[1, 2], [3, 4]]]
      };
      result = geoservices.convert.toGeoJSON(this.esriFeature);
      expected = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[[1, 2], [3, 4]]]
        },
        properties: {
          attr1: "val1"
        }
      };
      return assert.deepEqual(result, expected);
    });
    it("should convert a two path polyline", function() {
      var expected, result;
      this.esriFeature.geometry = {
        paths: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
      };
      result = geoservices.convert.toGeoJSON(this.esriFeature);
      expected = {
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
        },
        properties: {
          attr1: "val1"
        }
      };
      return assert.deepEqual(result, expected);
    });
    return it("should convert a single ring polygon", function() {
      var expected, result;
      this.esriFeature.geometry = {
        rings: [[[1, 2], [3, 4]], [[5, 6], [1, 2]]]
      };
      result = geoservices.convert.toGeoJSON(this.esriFeature);
      expected = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[1, 2], [3, 4]], [[5, 6], [1, 2]]]
        },
        properties: {
          attr1: "val1"
        }
      };
      return assert.deepEqual(result, expected);
    });
  });
});
