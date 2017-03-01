'use strict'

const APIvote = require('express').Router()
const db = require('../lib/mongodb-functions')

const bcl = require('../lib/bitcrypto')
const files = require('../lib/files')
const ObjectID = require('mongodb').ObjectID

const foldername = process.env.FOLDER_NAME || 'output-r2'

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
      files.appendFile(foldername, 'voters', newkey.address)
      res.send(newkey)
    }
  })
})
APIvote.get('/doesitvote', function (req, res) {
  const address = req.query.address
  db.findOne('voters', { _id: address }, function (err, record) {
    if (err) {
      res.send({err: 'error searching vote'})
      console.log('error searching vote - doesitvote', err)
    } else if (record === undefined || record.voted === false) {
      res.send('address without vote')
    } else {
      res.send('address voted')
    }
  })
})
APIvote.get('/checksignature', function (req, res) {
  let verified = bcl.checkSignature(req.query.address, req.query.plainvote, req.query.signedvote)
  if (verified === true) {
    res.send(true)
  }
  res.send(false)
})

APIvote.get('/castvote', function (req, res) {
  const address = req.query.address
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
        vote: req.query.plainvote,
        sign: req.query.signedvote,
        ad: address
      }
      // verified user signature
      let verified = bcl.checkSignature(address, req.query.plainvote, req.query.signedvote)
      if (verified === true) {
        // valid signature
        db.update('voters', {_id: address}, {voted: true, vote: ballot.vote, sign: ballot.sign}, function (err, record) {
          if (err) {
            res.send({err: 'error updating vote'})
          } else {
            files.appendFile(foldername, 'votes_valids', ballot)
            res.send({ok: 'vote processed successfully!'})
          }
        })
      } else {
        // invalid signature
        files.appendFile(foldername, 'votes_invalids', ballot)
        res.send({err: 'invalid signature'})
      }
    }
  })
})

module.exports = APIvote
