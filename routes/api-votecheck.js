const APIvotecheck = require('express').Router();
const db = require('../lib/mongodb-functions');

const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');

APIvotecheck.get('/', (req, res) => {
  res.redirect('index.html');
});
APIvotecheck.get('/results', (req, res) => {
  res.send("resulst");
});
APIvotecheck.get('/pollings', function(req, res) {
  db.find('polling',{},{_id:0},function(err, cbdbfindall){
    if(err){
      //logf.logError('polling','search pool','db error', err, cbdbfindall);
      res.send({err: 'error server search polling'});
    }else{
      res.send(cbdbfindall);
    }
  });
});
APIvotecheck.get('/getnewkey', function(req, res) {
  let privateKey = new bitcore.PrivateKey();
  let address = privateKey.toAddress();
  res.send({sk: privateKey, address: address});
  // log into new wallets counter (dtabase)
  // save to voters file
});
module.exports = APIvotecheck;

/**********************************************************************
*   Local Functions
**********************************************************************/
writeFile = function(foldername, filename, filedata){
  fs.writeFile('outputs/'+foldername +'/'+filename, JSON.stringify(filedata), function (err) {
    if (err) return console.log(err);
    console.log('Wrote!');
  });
}
