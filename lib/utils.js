
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
  return await readFile(filePath)
}

const callWriteFile = async (filePath, data) => {
  return await writeFile(filePath, data)
}


exports.getURL = getURL
exports.callReadFile = callReadFile
exports.callWriteFile = callWriteFile

