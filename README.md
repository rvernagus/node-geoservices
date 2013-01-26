# node-geoservices
A thin Node.js client for the ESRI GeoServices API.

## Documentation

### GeoServices API

http://www.esri.com/library/whitepapers/pdfs/geoservices-rest-spec.pdf

### When to Use
Use node-geoservices in Node.js applications that need to interact with [ArcGIS for Server](http://www.esri.com/software/arcgis/arcgisserver).

### Usage
Require:
```javascript
var geoservices = require('geoservices');
```

### Using Map Services
Export an image of a map:
```javascript
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
  console.log(result);
});
```
A Find operation on a map looks like this:
```javascript
var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/find',
  params: {
    searchText: 'island',
    contains: true,
    layers: '0,2',
    returnGeometry: true
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});
```

An Identify operation on a map looks like this:
```javascript
var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/identify',
  params: {
    geometryType: 'esriGeometryPoint',
    geometry: '-120,40',
    tolerance: 10,
    mapExtent: '-119,38,-121,41',
    imageDisplay: '400,300,96',
    returnGeometry: true
  }
};

geoservices.get(options, function(result) {
  console.log(result);
});
```

Query by attributes:
```javascript
var options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/1/query',
  params: {
    where: 'UPPER(STATE_NAME)=UPPER(\'colorado\')'
  }
};

geoservices.get(options, function(result) {
  console.log('Found: ' + result.features[0].attributes.STATE_NAME);
});
```

Spatial query:
```javascript
options = {
  host: 'sampleserver1.arcgisonline.com',
  path: '/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/1/query',
  params: {
    geometry: '-125.4,35.2,-118.7,43.8',
    geometryType: 'esriGeometryEnvelope',
    where: 'POP1999>5000000'
  }
};

geoservices.get(options, function(result) {
  console.log('Found: ' + result.features[0].attributes.STATE_NAME);
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History

### v0.1.0
  - Initial release

## License
Copyright (c) 2012 Ray Vernagus
Licensed under the MIT license.