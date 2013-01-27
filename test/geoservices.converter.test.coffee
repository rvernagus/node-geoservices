geoservices = require "../"
assert = require "assert"

describe "geoservices converter", ->
  describe "when converting from ESRI", ->
    it "should convert a point", ->
      esriPoint =
        attributes:
          attr1: "val1"
        geometry:
          x: 1
          y: 2
      result = geoservices.convert.toGeoJSON esriPoint
      expected =
        type: "Feature"
        geometry:
          type: "Point"
          coordinates: [1, 2]
        properties:
          attr1: "val1"
      assert.deepEqual result, expected