'use strict'

const APIadmin = require('express').Router()
const db = require('../lib/mongodb-functions')

const fs = require('fs')
const files = require('../lib/files')

const ipfs = require('../lib/ipfs')

const foldername = process.env.FOLDER_NAME || 'output-r2'

/*
* =============================================================================
* folder: output-op2
* files:
*  - election: description of the process, extra information
*  - candidates: array of candidates
*  - voters: valid voters (btc address)
*  - votes_valids: all votes made by voters (btc sign)
*  - votes_invalids: all votes made by hackers
*   ** (only 1 vote per user)
*   ***  each vote is [support 1 | oppose -1 | abstain 0] to each candidate
* tables:
*  - voters: btc address, does_it_vote (true, false)
*
* =============================================================================
*/

APIadmin.get('/data-integrity-process', (req, res) => {
  console.log('data integrity process: database & flat files show we equal')
})

// close election will send the files to IPFS and store hashes into MongoDB
APIadmin.get('/close-election', (req, res) => {
  const ipfsFilesToAddv2 = []
  files.readDirectory('outputs/' + foldername, function (err, items) {
    if (err) return console.log(err)
    console.log('function readdir items: ', items)
    for (let i = 0; i < items.length; i++) {
      ipfsFilesToAddv2.push({
        path: 'outputs/' + foldername + '/' + items[i],
        content: fs.createReadStream('outputs/' + foldername + '/' + items[i])
      })
    }
    console.log('ipfsFilesToAdd from directory', ipfsFilesToAddv2)
    ipfs.saveFilesV2(ipfsFilesToAddv2, function (err, cbipfshash) {
      if (err) {
        res.send({err: err})
        console.log(err)
      }
      console.log('ipfs.saveFiles', cbipfshash)
      res.send({ipfssaveFilesV2: cbipfshash})
    })
  })
})

// valite vote will check if the address is in the valid votes for candidate
// number, and then check signature
APIadmin.get('/get-ipfs-files', (req, res) => {
  const hash = req.query.hash
  const repopath = req.query.repopath
  console.log('req', req.query)
  console.log(`/get-ipfs-file-op2 hash: ${hash} - repopath ${repopath}`)
  ipfs.getFile(repopath, hash, function (err, cbfile) {
    if (err) {
      console.log('error ipfs.getFile', err)
      res.send({err: err})
    } else {
      res.send({file: cbfile})
    }
  })
})

module.exports = APIadmin
