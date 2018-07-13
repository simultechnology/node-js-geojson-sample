
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function getURL (URL) {
  return new Promise(function (resolve, reject) {
    const req = new window.XMLHttpRequest()
    req.open('GET', URL, true)
    req.onload = function () {
      if (req.status === 200) {
        resolve(req.responseText)
      } else {
        reject(new Error(req.statusText))
      }
    }
    req.onerror = function () {
      reject(new Error(req.statusText))
    }
    req.send()
  })
}

const callReadFile = async (filePath) => {
  return readFile(filePath)
}

const callWriteFile = async (filePath, data) => {
  return writeFile(filePath, data)
}

function degToms (value) {
  return value * 60 * 60 * 1000
}

function getAdjustZoom (latLon1, latLon2, size) {
  const zoomRange = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  const latLonPerPx = {
    lat: {}, lon: {}
  }
  latLonPerPx.lat[20] = 0.5
  latLonPerPx.lon[20] = 0.625
  for (let i = 19; i >= 0; i--) {
    latLonPerPx.lat[i] = latLonPerPx.lat[i + 1] * 2
    latLonPerPx.lon[i] = latLonPerPx.lon[i + 1] * 2
  }

  const pointHeightDistance = Math.abs(degToms(latLon1.lat) - degToms(latLon2.lat))
  const pointWidthDistance = Math.abs(degToms(latLon1.lon) - degToms(latLon2.lon))

  let targetZoom = 0
  // 点列が入る範囲になるまで縮尺を上げる
  for (let zoom = zoomRange.length - 1; zoom >= 0; zoom--) {
    const windowHeightDistance = latLonPerPx.lat[zoom] * size
    const windowWidthDistance = latLonPerPx.lon[zoom] * size

    if (pointHeightDistance <= windowHeightDistance && pointWidthDistance <= windowWidthDistance) {
      targetZoom = zoom
      break
    }
  }
  return (targetZoom - 2)
}

exports.getURL = getURL
exports.callReadFile = callReadFile
exports.callWriteFile = callWriteFile
exports.getAdjustZoom = getAdjustZoom
