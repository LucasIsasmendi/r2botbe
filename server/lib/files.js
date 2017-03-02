'use strict'

const fs = require('fs')

function appendFile (foldername, filename, filedata, delimiter) {
  const data = JSON.stringify(filedata) + delimiter
  fs.appendFile(foldername + '/' + filename, data, (err) => {
    if (err) throw err
  })
}

function writeFile (foldername, filename, filedata) {
  fs.writeFile(foldername + '/' + filename, JSON.stringify(filedata), function (err) {
    if (err) throw err
  })
}

function checkDirectory (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    console.log('Directory to write files created: ', dir)
  } else {
    console.log('Directory to write files exists: ', dir)
  }
}

function readDirectory (path) {
  fs.readdir(path, function (err, items) {
    if (err) throw err
    console.log('function readDirectory items: ', items)
    return items
  })
}

module.exports = {
  appendFile: appendFile,
  writeFile: writeFile,
  checkDirectory: checkDirectory,
  readDirectory: readDirectory
}
