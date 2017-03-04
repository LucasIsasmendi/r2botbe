'use strict'

const APIuser = require('express').Router()
const db = require('../lib/mongodb-functions')

APIuser.get('/test', (req, res) => {
  res.send('response from API user')
})
APIuser.post('/addbyphone', function (req, res) {
  const phone = req.body.phone
  const hkid = req.body.hkid
  db.insert('users', { _id: phone, hkid: hkid, voted: false }, function (err, cb) {
    if (err) {
      if (err.code === 11000) {
        res.send('phone already added')
      } else {
        res.send({err: 'error adding user by phone'})
        console.log('error insert user', err)
      }
    } else {
      res.send('user added by phone')
    }
  })
})
APIuser.get('/getbyphone', function (req, res) {
  const phone = req.body.phone
  db.findOne('users', { _id: phone }, function (err, record) {
    if (err) {
      res.send({err: 'error searching user by phone'})
      console.log('error searching user - getbyphone', err)
    } else if (record) {
      res.send('user exists', record)
    } else {
      res.send('phone doesn`t exist')
    }
  })
})
APIuser.get('/getbytid', function (req, res) {
  const telegramid = req.body.telegramid
  db.findOne('users', { tid: telegramid }, function (err, record) {
    if (err) {
      res.send({err: 'error searching user by telegramid'})
      console.log('error searching user - getbytelegramid', err)
    } else if (record) {
      record.signed_up = true
      res.send(record)
    } else {
      res.send('telegramid doesn`t exist')
    }
  })
})
APIuser.post('/signup', function (req, res) {
  const phone = req.body.phone
  const hkid = req.body.hkid
  const tid = req.body.tid
  db.insert('users', { _id: phone, hkid: hkid, tid: tid, voted: false }, function (err, cb) {
    if (err) {
      if (err.code === 11000) {
        res.send('phone already added')
      } else {
        res.send({err: 'error adding user by phone'})
        console.log('error insert user', err)
      }
    } else {
      res.send('user added by phone')
    }
  })
})
APIuser.post('/votedone', function (req, res) {
  const phone = req.body.phone
  db.update('users', { _id: phone }, {$set: {voted: true}}, function (err, cb) {
    if (err) {
      if (err.code === 11000) {
        res.send('phone already vote')
      } else {
        res.send({err: 'error updating user'})
        console.log('error updating user', err)
      }
    } else {
      res.send('vote done')
    }
  })
})
APIuser.get('/doesitvote', function (req, res) {
  const phone = req.body.phone
  db.findOne('users', { _id: phone }, function (err, record) {
    if (err) {
      res.send({err: 'error searching vote'})
      console.log('error searching vote - doesitvote', err)
    } else if (record.voted === true) {
      res.send('user vote')
    } else {
      res.send('user doesn`t vote')
    }
  })
})

module.exports = APIuser
