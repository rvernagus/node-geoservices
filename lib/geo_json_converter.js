module.exports = (function() {
  function GeoJSONConverter() {}

  var getGeoJSONGeometry = function(esriFeature) {
    var g = esriFeature.geometry;
    if (g.x) {
      return {
        type: 'Point',
        coordinates: [g.x, g.y]
      };
    } else if (g.points) {
      return {
        type: 'MultiPoint',
        coordinates: g.points
      };
    } else if (g.paths) {
      if (g.paths.length === 1) {
        return {
          type: 'LineString',
          coordinates: g.paths
        };
      } else {
        return {
          type: 'MultiLineString',
          coordinates: g.paths
        };
      }
    } else if (g.rings) {
      return {
        type: 'Polygon',
        coordinates: g.rings
      };
    } else {
      throw new Error('Invalid geometry');
    }
  };

  var getGeoJSONFeature = function(esriFeature) {
    return {
      type: 'Feature',
      properties: esriFeature.attributes,
      geometry: getGeoJSONGeometry(esriFeature)
    };
  };

  GeoJSONConverter.prototype.toGeoJSON = function(esriIn) {
    if (esriIn.length) {
      var results = [];
      var len = esriIn.length;
      for (var i = 0; i < len; i++) {
        var f = getGeoJSONFeature(esriIn[i]);
        results.push(f);
      }
      return results;
    } else {
      return getGeoJSONFeature(esriIn);
    }
  };

  return GeoJSONConverter;

})();
