const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// const path = require('path')
// const engines = require('consolidate')

const APIvote = require('./routes/vote')
const APIadmin = require('./routes/admin')
const APIuser = require('./routes/user')
const db = require('./lib/mongodb-functions')

const server = require('http').createServer(app)
const servers = require('https').createServer(app)

app.set('port', process.env.PORT || 8080)
app.set('sslport', process.env.SSLPORT || 4701)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/', APIvote)
app.use('/user', APIuser)
app.use('/admin', APIadmin)

db.open(function () {
  console.log('db is initialize...')
})

const host = app.get('host')
const httpport = app.get('port')
const environment = app.get('env')

server.listen(httpport)
console.log(`http app is running at host: ${host} - port: ${httpport} environment: ${environment}`)

if (environment === 'production') {
  const sslport = app.get('sslport')
  servers.listen(sslport)
  console.log(`https app is running at host: ${host} - port: ${sslport} environment: ${environment}`)
} else if (environment === 'test') {
  module.exports = server
  console.log('test server')
}
