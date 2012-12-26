var geoservices = require('../');

options = {
  host: 'sampleserver3.arcgisonline.com',
  path: '/ArcGIS/rest/services/Earthquakes/SanAndreasLidar/ImageServer/identify',
  params: {
    geometry: '575505.5,3733770',
    geometryType: 'esriGeometryPoint',
    pixelSize: '0.5,0.5'
  }
};

geoservices.post(options, function(result) {
  console.log(result);
});

var options = {
  host: 'sampleserver3.arcgisonline.com',
  path: '/ArcGIS/rest/services/Earthquakes/SanAndreasLidar/ImageServer/identify',
  params: {
    geometry: {
      rings: [[
        [-13555360.4191, 5911556.581], 
        [-13489311.5669, 5898227.932], 
        [-13423477.4153, 5884426.3329], 
        [-13602646.9571, 5717848.4135], 
        [-13587119.9125, 5781976.6214], 
        [-13571360.1713, 5846543.2654], 
        [-13555360.4191, 5911556.581]
      ]]
    },
    geometryType: 'esriGeometryPolygon',
    mosaicRule: {
      mosaicMethod: 'esriMosaicAttribute',
      where: "Name NOT LIKE 'Ov%'",
      sortField: 'Name',
      mosaicOperation: 'MT_MAX'
    }
  }
};

geoservices.post(options, function(result) {
  console.log(result);
});