var geoservices = require('../');

var options = {
  host: 'sampleserver3.arcgisonline.com',
  path: '/ArcGIS/rest/services/Network/USA/NAServer/Service Area/solveServiceArea',
  params: {
    facilities: {
      features: [
        {
          attributes: {
            Name: 'San Francisco Museum of Modern Art',
            Breaks_Length: 10.0
          },
          geometry: {
            x: -122.401134465,
            y: 37.7857056500001
          }
        }
      ]
    },
    barriers: {},
    polylineBarriers: {},
    polygonBarriers: {},
    defaultBreaks: 5.0,
    mergeSimilarPolygonRanges: false,
    overlapLines: false,
    overlapPolygons: false,
    splitLinesAtBreaks: false,
    splitPolygonsAtBreaks: false,
    trimOuterPolygon: false,
    trimPolygonDistance: 100.0,
    trimPolygonDistanceUnits: 'esriMeters',
    outSR: 26911,
    impedanceAttributeName: 'Length',
    restrictUTurns: 'esriNFSBAllowBacktrack',
    returnFacilities: true,
    returnBarriers: true,
    returnPolylineBarriers: false,
    returnPolygonBarriers: false,
    outputLines: 'esriNAOutputLineNone',
    outputPolygons: 'esriNAOutputPolygonSimplified',
    travelDirection: 'esriNATravelDirectionFromFacility',
    outputGeometryPrecision: 0.01,
    outputGeometryPrecisionUnits: 'esriMeters'
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});