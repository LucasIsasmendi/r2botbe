const APIadmin = require('express').Router();
const db = require('../lib/mongodb-functions');

const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const randomstring = require("randomstring");

const crypto = require('crypto');
const fs = require('fs');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const _ = require('lodash');

const bitcoin = require('bitcoinjs-lib');

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');

let validVotes = [];
let allVotes = [];

APIadmin.get('/run-simulation-op1', (req, res) => {
  /***************************************************
  * Seed content
  ****************************************************/
  let votersNumber = req.body.voters;
  let hackersNumber = req.body.hackers;
  let foldername = 'output-op1';
  console.log(`run-simulation-op1 -input totals votersNumber:${votersNumber}, hackersNumber: ${hackersNumber}, foldername:${foldername}`);

  // generate 100 voters keys
  const voters = generateWallets(100);
  //console.log(`voter 1, PublicKey:${voters[1].pk}, PrivateKey: ${voters[1].sk}, ecKey: ${voters[1].key}`);
  console.log(`voter 1, sk: ${voters[1].sk}, address: ${voters[1].address}`);
  writeFile(foldername, 'voters',voters);

  // generate 1000 hackers keys
  const hackers = generateWallets(1000);
  //console.log(`hacker 1, PublicKey:${hackers[1].pk}, PrivateKey: ${hackers[1].sk}, ecKey: ${hackers[1].key}`);
  console.log(`hacker 1, sk: ${hackers[1].sk}, address: ${hackers[1].address}`);
  writeFile(foldername, 'hackers',hackers);

  // set candidates array
  const candidates = ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk", "Tony Stark", "Bruce Wayne"];
  const totalByCandidate = [0,0,0,0,0,0];

  // run election
  // loop voters
  let totalVoters = voters.length;
  for(let i=0; i < totalVoters; i++){
    let voteTo = randomIntInc(0,5);
    let candidate = candidates[voteTo];
    let message = new Message(candidate);
    let signature = message.sign(voters[i].sk);
    allVotes.push({candidateN:voteTo, signature: signature, address: voters[i].address});
  }
  console.log("allVotes length after voters",allVotes.length);
  // loop hackers
  let totalHacks = hackers.length;
  for(let i=0; i < totalHacks; i++){
    let voteTo = randomIntInc(0,5);
    let candidate = candidates[voteTo];
    let message = new Message(candidate);
    let signature = message.sign(hackers[i].sk);
    allVotes.push({candidateN:voteTo, signature: signature, address: hackers[i].address});
  }
  console.log("allVotes length after hackers",allVotes.length);

  writeFile(foldername, 'allVotes',allVotes);
  // validate votes
  let totalVotes = allVotes.length;
  for(let i=0; i < totalVotes; i++){
    let vote = allVotes[i];
    let voterisinlist = _.find(voters, function(v){ return v.address === vote.address});
    if(voterisinlist){
      // check valid signature
      let validSignature = new Message(candidates[vote.candidateN]).verify(vote.address, vote.signature);
      if(validSignature){
        validVotes.push(vote);
      }
    }
  }
  writeFile(foldername, 'validVotes',validVotes);
  console.log("validVotes length", validVotes.length);
  // End election: hash files / and write to BTC
  res.send({status: 'ok', totals: {voters: voters.length, validvotes: validVotes.length}});
});

APIadmin.get('/generate-totals-op1', (req, res) => {
  let foldername = 'ipfs-btc-a1';
  // total votes allvotes by candidate
  // total votes validvotes by candidate
  res.send("resulst");
});

APIadmin.get('/run-simulation-op2', (req, res) => {
  /***************************************************
  * Seed content
  ****************************************************/
  let votersNumber = req.body.voters;
  let hackersNumber = req.body.hackers;
  let foldername = 'output-op2-red';
  console.log(`run-simulation-op2 -input totals votersNumber:${votersNumber}, hackersNumber: ${hackersNumber}, foldername:${foldername}`);
  // generate 100 voters keys
  const voters = generateWallets(100);
  //console.log(`voter 1, PublicKey:${voters[1].pk}, PrivateKey: ${voters[1].sk}, ecKey: ${voters[1].key}`);
  console.log(`voter 1, sk: ${voters[1].sk}, address: ${voters[1].address}`);
  writeFile(foldername,'voters',voters);

  // generate 1000 hackers keys
  const hackers = generateWallets(1000);
  //console.log(`hacker 1, PublicKey:${hackers[1].pk}, PrivateKey: ${hackers[1].sk}, ecKey: ${hackers[1].key}`);
  console.log(`hacker 1, sk: ${hackers[1].sk}, address: ${hackers[1].address}`);
  writeFile(foldername, 'hackers',hackers);

  // set candidates array
  const candidates = ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk", "Tony Stark", "Bruce Wayne"];
  const totalByCandidate = [0,0,0,0,0,0];

  // run election
  // loop voters
  let writefiles = 0;
  let totalVoters = voters.length;
  for(let i=0; i < totalVoters; i++){
    let voteTo = randomIntInc(0,5);
    let candidate = candidates[voteTo];
    let message = new Message(candidate);
    let signature = message.sign(voters[i].sk);
    writeFile(foldername, voters[i].address,{candidate:candidate, signature: signature});
    writefiles++;
  }
  console.log("writefiles length after voters",writefiles);
  // loop hackers
  let totalHacks = hackers.length;
  for(let i=0; i < totalHacks; i++){
    let voteTo = randomIntInc(0,5);
    let candidate = candidates[voteTo];
    let message = new Message(candidate);
    let signature = message.sign(hackers[i].sk);
    writeFile(foldername, hackers[i].address,{candidate:candidate, signature: signature});
    writefiles++;
  }
  console.log("writefiles length after hackers",writefiles);


  // End election: hash files / and write to BTC
  res.send({status: 'ok', totals: {voters: voters.length, writefiles: writefiles}});
});


module.exports = APIadmin;

/**********************************************************************
*   Local Functions
**********************************************************************/
function rng () { return new Buffer(randomstring.generate()) }
generateWallets = function(total){
  let wallets = [];
  for(let i = 0; i < total; i++){
    //let newUser = crypto.createECDH('secp256k1');
    //let walletKeys = newUser.generateKeys();

    // let keyPair = bitcoin.ECPair.makeRandom({rng:rng});

    let privateKey = new bitcore.PrivateKey();
    let address = privateKey.toAddress();
    wallets.push({
      i: i,
      sk: privateKey,
      address: address
    });
    /**
    pk: newUser.getPublicKey('hex'),
    sk: newUser.getPrivateKey('hex'),
    key: ec.genKeyPair(),
    key: keyPair
     */
  }
  return wallets;
};

writeFile = function(foldername, filename, filedata){
  fs.writeFile('outputs/'+foldername +'/'+filename, JSON.stringify(filedata), function (err) {
    if (err) return console.log(err);
    console.log('Wrote!');
  });
}
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
