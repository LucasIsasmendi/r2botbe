'use strict'

const APIadmin = require('express').Router()
const db = require('../lib/mongodb-functions')

const fs = require('fs')
const files = require('../lib/files')

const ipfs = require('../lib/ipfs')

const config = require('../config/config')
const folderOutput = config.FOLDER_OUTPUT

const filenameValidVotes = config.FLN_VALID_VOTES
const filenameInvalidVotes = config.FLN_INVALID_VOTES
const filenameVoters = config.FLN_VOTERS

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
function getFileName (filetype) {
  const filenameDownload = {
    'valid_votes': filenameValidVotes,
    'invalid_votes': filenameInvalidVotes,
    'voters': filenameVoters
  }
  return filenameDownload[filetype] || 'fnf'
}

APIadmin.get('/downloadfile/:filename', (req, res) => {
  let fileName = getFileName(req.params.filename)
  if (fileName === 'fnf') {
    res.send('invalid file name')
  } else {
    let filePath = [folderOutput, fileName].join('/')
    console.log('filePath', filePath)
    res.writeHead(200, {
      'Content-Typ': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + fileName})
    fs.createReadStream(filePath).pipe(res)
  }
})

APIadmin.get('/data-integrity-process', (req, res) => {
  console.log('data integrity process: database & flat files show we equal')
})

// close election will send the files to IPFS and store hashes into MongoDB
APIadmin.get('/close-election', (req, res) => {
  const ipfsFilesToAddv2 = []
  files.readDirectory('outputs/' + folderOutput, function (err, items) {
    if (err) return console.log(err)
    console.log('function readdir items: ', items)
    for (let i = 0; i < items.length; i++) {
      ipfsFilesToAddv2.push({
        path: 'outputs/' + folderOutput + '/' + items[i],
        content: fs.createReadStream('outputs/' + folderOutput + '/' + items[i])
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
