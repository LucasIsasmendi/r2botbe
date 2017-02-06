'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const series = require('async/series')
const IPFS = require('ipfs')
const Promise = require('promise')
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const concat = require('concat-stream')

module.exports = {
  // from ipfs example basic
  saveFiles: function(filesToAddArray, cb) {
    const repoPath = String(Math.random())
    const node = new IPFS(repoPath)
    const filesMultihash =[];
    series([
      /*
       * Display version of js-ipfs
       */
      (cb) => {
        node.version((err, version) => {
          if (err) { return cb(err) }

          console.log('IPFS Version:', version.version)
          cb()
        })
      },
      /*
       * Initialize the repo for this node
       */
      (cb) => node.init({ emptyRepo: true, bits: 2048 }, cb),
      /*
       * Load the repo config into the IPFS node
       */
      (cb) => node.load(cb),
      /*
       * Take the node online (bitswap, network and so on)
       */
      (cb) => node.goOnline(cb),
      /*
       * Add a file to IPFS - Complete Files API on:
       * https://github.com/ipfs/interface-ipfs-core/tree/master/API/files
       */
      (cb) => {
        if (node.isOnline()) {
          console.log('\nNode is now ready and online')
        }
        //filesToAddArray.forEach(fileToAdd, index);
        node.files.add(filesToAddArray, (err, result) => {
          if (err) { return cb(err) }
          console.log('\nAdded file:', filesToAddArray)
          console.log(result)
          filesMultihash.push(result)
          cb()
        })
        /**
        const totalFiles = filesToAddArray.length;
        for (let i = 0; i < totalFiles; i++){
          let fileToAdd = filesToAddArray[i];
          node.files.add(fileToAdd, (err, result) => {
            if (err) { return cb(err) }
            console.log('\nAdded file:', fileToAdd)
            console.log(result[0])
            filesMultihash.push(result[0].hash)
          })
        }
        cb()
        */
      }
    ], (err) => {
      if (err) {
        return console.log(err)
      }
      let newData = {repoPath: repoPath, filesMultihash: filesMultihash}
      console.log('Success!', newData)
      cb(newData)
    })
  },
  saveFilesV2 : function(files, cb){
    const node = new IPFS(path.join(os.tmpDir() + '/' + new Date().toString()))
    const promises = files.map(async ((filePath) => {
      //const fileName = path.basename(filePath)
      try {
        const stream = await (fs.createReadStream(filePath.path))
        const file = {
            path: filePath.path, // fileName works as well,
            content: stream
        }
        return file
      } catch(e) {
        console.log(e)
      }
    }))
    console.log("promises",promises)
    const filesready = await (Promise.all(promises))
    console.log("filesready: ", filesready)
    const result = await (node.files.add(filesready))
    console.log("result: ", result)
    cb(filesready, result)

  },
  getFiles: function(repoPath, multiFilesToGetByHash, cb) {
    const node = new IPFS(repoPath)
    const totalFiles = multiFilesToGetByHash.length;
    for (let i = 0; i < totalFiles; i++){
      let fileHashToGet = multiFilesToGetByHash[i];
      node.files.cat(fileHashToGet, (err, stream) => {
        if (err) { return cb(err) }

        console.log('\nFile content:')
        stream.pipe(process.stdout)
        stream.on('end', process.exit)
      })
    }
  },
  getFile: function(repoPath, hash, cb) {
    const node = new IPFS(repoPath)
    node.files.cat(hash, (err, stream) => {
      if (err || !stream) {
        console.error('ipfs cat error', err, stream)
        return cb(err, null)
      }
      let opts= {encoding: "string"}
      stream.pipe(concat( opts, function(data){
        console.log('\nFile data:',data)
        cb(null, data)
      }))
    })
  }
}
