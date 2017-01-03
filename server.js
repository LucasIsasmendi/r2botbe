const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const path = require('path');
const engines = require('consolidate');;

const APIvotecheck = require('./routes/api-votecheck');
const APIadmin = require('./routes/api-admin');
const db = require('./lib/mongodb-functions');

const server = require('http').createServer(app);
const servers = require('https').createServer(app);

app.set('port', process.env.PORT || 8080);
app.set('sslport', process.env.SSLPORT || 4701);
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/public'));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/',APIvotecheck);
app.use('/admin',APIadmin);

db.open(function() {
  console.log("db is initialize...");
});
if (app.get('env') == 'production') {
  servers.listen(app.get('sslport'));
  console.log("https app is running at host: " + app.get('host') + " - port: " + app.get('sslport') +"- environment: "+ app.get('env'));
}
server.listen(app.get('port'));
console.log("http app is running at host: " + app.get('host') + " - port: " + app.get('port') +"- environment: "+ app.get('env'));
