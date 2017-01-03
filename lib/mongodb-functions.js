var config = require('../config/config');
var environment;
if(process.env.NODE_ENV === undefined ){
  environment = "development";
  var Db = require('mongodb').Db, Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

  var envHost = process.env['MONGO_NODE_DRIVER_HOST'], envPort = process.env['MONGO_NODE_DRIVER_PORT'],
    host = envHost != null ? envHost: 'localhost', port = envPort != null ? envPort:27017;
  var db = new Db('voteck',new Server(host, port, {}),{native_parser:false});
} else {
  environment = config.DB_ENV;
  var Db = require('mongodb').Db, Connection = require('mongodb').Connection,
  Server = require('mongodb').Server, MongoClient = require('mongodb').MongoClient;

  var mongoHost = config.VOTECK_MONGO_URI,
    mongoPort = config.VOTECK_MONGO_PORT;
  var mongoVOTECK = new MongoClient(new Server(mongoHost, mongoPort));
}

module.exports = {
  addMensaje: function(name, cp, newMensaje, callback){
    db.collection(name).update({cp: cp}, {$push:{msjs:{ $each: [newMensaje], $position: 0}} }, callback);
  },
  find: function(name, query,params, callback) {
    db.collection(name).find(query,params).toArray(callback);
  },
  findcbarr: function(name, query, callback) {
    db.collection(name).find(query).toArray(callback);
  },
  findLimit: function(name, query, limit, callback) {
    db.collection(name).find(query).sort({_id: -1}).limit(limit).toArray(callback);
  },
  findOne: function(name, query, callback) {
    db.collection(name).findOne(query, callback);
  },
  findAll: function(name,callback) {
    db.collection(name).find().toArray(callback);
  },
  insert: function(name, items, callback) {
    db.collection(name).insert(items, callback);
  },
  upsert: function(name, query, updateQuery, callback) {
    db.collection(name).update(query, updateQuery, {upsert:true}, callback);
  },
  open: function(callback) {
    // 19/06/2014: OJO con esto, posible agujero de seguridad
    if(environment === "development"){
      db.open(function(err,rta){
        console.log("open db voteck", environment);
        callback();
      });
    } else {
      mongoVOTECK.connect(config.VOTECK_MONGO_URI,function(err, mongoVOTECKCB) {
        if(err){
          console.log("open voteck err:",err)
        } else {
          db = mongoVOTECKCB.db(config.VOTECK_MONGO_DB);
          console.log("open db voteck: ",environment);
          callback();
        }
      });
    }
  },
  close: function(callback){
    // 28/02/2015: OJO con esto, posible agujero de seguridad
    if(environment === "development"){
      db.close(function(err,cb){
        console.log("close db negocios",err, cb);
        callback(cb);
      });

    } else{
      mongoVOTECK.close(config.VOTECK_MONGO_URI, function(err, mongoBusinessCb) {
        callback(mongoBusinessCb);
      });
    }
  }
}
