
console.log('start')

const utils = require('./lib/utils')
const turf = require('@turf/turf')

utils.callReadFile('./data/shiteikasen.json')
  .then((content) => {
    let geojson = JSON.parse(content.toString())
    console.log(geojson)
    const buf = [];
    geojson.features.forEach((feature) => {
      const geom = turf.getGeom(feature)
      const bbox = turf.bbox(geom);
      buf.push({
        river_no: feature.properties.RIVER_NO,
        name: feature.properties.FRCST_AREA,
        bbox: bbox
      })
    })
    return buf
  })
  .then(data => {
    console.log('data!')
    console.log(data)
    utils.callWriteFile('./output/rivers.json', JSON.stringify(data))
  })
