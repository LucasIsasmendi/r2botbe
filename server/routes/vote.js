'use strict'

const APIvote = require('express').Router()
const db = require('../lib/mongodb-functions')

const bcl = require('../lib/bitcrypto')
const files = require('../lib/files')
const ObjectID = require('mongodb').ObjectID

const config = require('../config/config')
const folderOutput = config.FOLDER_OUTPUT

const filenameValidVotes = 'valid_votes'
const filenameInvalidVotes = 'invalid_votes'
const filenameVoters = 'voters'

const delimiterNewLine = '\r\n'

files.checkDirectory(folderOutput)

APIvote.get('/test', (req, res) => {
  res.send('response from API vote')
})
APIvote.get('/getnewkey', function (req, res) {
  const newkey = bcl.generateKey()
  db.insert('voters', { _id: newkey.address, voted: false }, function (err, cb) {
    if (err) {
      res.send({err: 'error adding voters'})
      console.log('error insert new voter address - getnewkey', err)
    } else {
      files.appendFile(folderOutput, filenameVoters, newkey.address, delimiterNewLine)
      res.send(newkey)
    }
  })
})
APIvote.get('/doesitvote', function (req, res) {
  const address = req.body.address
  db.findOne('voters', { _id: address }, function (err, record) {
    if (err) {
      res.send({err: 'error searching vote'})
      console.log('error searching vote - doesitvote', err)
    } else if (record === undefined || record === null) {
      res.send('invalid address')
    } else if (record.voted === false) {
      res.send('address without vote')
    } else {
      res.send('address voted')
    }
  })
})

APIvote.get('/signballot', function (req, res) {
  let signedvote = bcl.signMessage(req.body.ballot, req.body.secretkey)
  res.send({signedvote: signedvote})
})

APIvote.get('/checksignature', function (req, res) {
  let verified = bcl.checkSignature(req.body.address, req.body.plainvote, req.body.signedvote)
  if (verified === true) {
    res.send('valid signature')
  }
  res.send('invalid signature')
})

APIvote.post('/castvote', function (req, res) {
  const address = req.body.address
  db.findOne('voters', { _id: address }, function (err, record) {
    if (err) {
      res.send({err: 'error searching address'})
      console.log('error searching address - castvote', err)
    } else if (record === undefined) {
      // invalid address
      res.send({err: 'invalid address'})
    } else if (record.voted === true) {
      // address already vote
      res.send({err: 'address already vote'})
    } else {
      const ballot = {
        ad: address,
        vote: req.body.plainvote,
        sign: req.body.signedvote
      }
      // verified user signature
      let verified = bcl.checkSignature(ballot.ad, ballot.vote, ballot.sign)
      if (verified === true) {
        // valid signature
        db.update('voters', {_id: address}, {voted: true, vote: ballot.vote, sign: ballot.sign}, function (err, record) {
          if (err) {
            res.send({err: 'error updating vote'})
          } else {
            files.appendFile(folderOutput, filenameValidVotes, ballot, delimiterNewLine)
            res.send('vote processed successfully!')
          }
        })
      } else {
        // invalid signature
        files.appendFile(folderOutput, filenameInvalidVotes, ballot, delimiterNewLine)
        res.send({err: 'invalid signature'})
      }
    }
  })
})

APIvote.post('/castvotefull', function (req, res) {
  const newkey = bcl.generateKey()
  const signedvote = bcl.signMessage(req.body.plainvote, newkey.sk)
  const ballot = {
    address: newkey.address,
    vote: req.body.plainvote,
    sign: signedvote
  }
  db.insert('voters', {_id: ballot.address, voted: true, vote: ballot.vote, sign: ballot.sign}, function (err, record) {
    if (err) {
      res.send({err: 'error updating vote'})
    } else {
      files.appendFile(folderOutput, filenameValidVotes, ballot, delimiterNewLine)
      files.appendFile(folderOutput, filenameVoters, newkey.address, delimiterNewLine)
      res.send({status: 'vote processed successfully!', ballot: ballot, key: newkey})
    }
  })
})

module.exports = APIvote
