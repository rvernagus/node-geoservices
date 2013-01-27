var assert, geoservices;

geoservices = require("../");

assert = require("assert");

describe("geoservices converter", function() {
  return describe("when converting from ESRI", function() {
    return it("should convert a point", function() {
      var esriPoint, expected, result;
      esriPoint = {
        attributes: {
          attr1: "val1"
        },
        geometry: {
          x: 1,
          y: 2
        }
      };
      result = geoservices.convert.toGeoJSON(esriPoint);
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
  });
});
