'use strict'

const fs = require('fs')

function appendFile (foldername, filename, filedata) {
  fs.appendFile(foldername + '/' + filename, JSON.stringify(filedata), (err) => {
    if (err) throw err
    console.log('Added!', filename)
  })
}

function writeFile (foldername, filename, filedata) {
  fs.writeFile(foldername + '/' + filename, JSON.stringify(filedata), function (err) {
    if (err) throw err
    console.log('Wrote!', filename)
  })
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
  readDirectory: readDirectory
}
