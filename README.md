# node-geoservices
A thin Node.js client for the ESRI GeoServices API.

## Documentation

### GeoServices API

http://www.esri.com/library/whitepapers/pdfs/geoservices-rest-spec.pdf

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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History

### v0.1.0
  - Initial release

## License
Copyright (c) 2012 Ray Vernagus
Licensed under the MIT license.