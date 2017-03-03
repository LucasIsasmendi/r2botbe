'use strict'

const fs = require('fs')
const path = require('path')

function appendFile (foldername, filename, filedata, delimiter) {
  const data = JSON.stringify(filedata) + delimiter
  const fullPathFile = path.join(__dirname, foldername, filename)
  fs.appendFile(fullPathFile, data, (err) => {
    if (err) throw err
  })
}

function writeFile (foldername, filename, filedata) {
  const fullPathFile = path.join(__dirname, foldername, filename)
  fs.writeFile(fullPathFile, JSON.stringify(filedata), function (err) {
    if (err) throw err
  })
}

function checkDirectory (dir) {
  const fullPathDir = path.join(__dirname, dir)
  if (!fs.existsSync(fullPathDir)) {
    fs.mkdirSync(fullPathDir)
    console.log('Directory to write files created: ', fullPathDir)
  } else {
    console.log('Directory to write files exists: ', fullPathDir)
  }
}

function readDirectory (pathdir) {
  const fullPathDir = path.join(__dirname, pathdir)
  fs.readdir(fullPathDir, function (err, items) {
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
