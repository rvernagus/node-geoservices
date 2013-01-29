geoservices = require "../"
assert = require "assert"

describe "geoservices converter", ->
  describe "when converting from ESRI", ->
    before ->
      @esriFeature =
        attributes:
          attr1: "val1"

    it "should convert a point", ->
      @esriFeature.geometry = {x:1, y:2}
      result = geoservices.convert.toGeoJSON @esriFeature
      expected =
        type: "Feature"
        geometry:
          type: "Point"
          coordinates: [1, 2]
        properties:
          attr1: "val1"
      assert.deepEqual result, expected

    it "should error upon empty point", ->
      @esriFeature.geometry = {}
      assert.throws (-> geoservices.convert.toGeoJSON @esriFeature), Error
    it "should convert an array of points", ->
      @esriFeature.geometry = {x:1, y:2}
      esriFeatures = [@esriFeature, @esriFeature]
      result = geoservices.convert.toGeoJSON esriFeatures
      assert.equal 2, result.length

    it "should convert a multipoint", ->
      @esriFeature.geometry = {points: [[1, 2], [3, 4]]}
      result = geoservices.convert.toGeoJSON @esriFeature
      expected =
        type: "Feature"
        geometry:
          type: "Multipoint"
          coordinates: [[1, 2], [3, 4]]
        properties:
          attr1: "val1"
      assert.deepEqual result, expected

    it "should convert a one path polyline", ->
      @esriFeature.geometry = {paths: [[[1,2],[3,4]]]}
      result = geoservices.convert.toGeoJSON @esriFeature
      expected =
        type: "Feature"
        geometry:
          type: "LineString"
          coordinates: [[[1,2],[3,4]]]
        properties:
          attr1: "val1"
      assert.deepEqual result, expected

    it "should convert a two path polyline", ->
      @esriFeature.geometry = {paths: [[[1,2],[3,4]],[[5,6],[7,8]]]}
      result = geoservices.convert.toGeoJSON @esriFeature
      expected =
        type: "Feature"
        geometry:
          type: "MultiLineString"
          coordinates: [[[1,2],[3,4]],[[5,6],[7,8]]]
        properties:
          attr1: "val1"
      assert.deepEqual result, expected

    it "should convert a single ring polygon", ->
      @esriFeature.geometry = {rings: [[[1,2],[3,4]],[[5,6],[1,2]]]}
      result = geoservices.convert.toGeoJSON @esriFeature
      expected =
        type: "Feature"
        geometry:
          type: "Polygon"
          coordinates: [[[1,2],[3,4]],[[5,6],[1,2]]]
        properties:
          attr1: "val1"
      assert.deepEqual result, expected