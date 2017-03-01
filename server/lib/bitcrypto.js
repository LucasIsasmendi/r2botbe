'use strict'

const bitcore = require('bitcore-lib')
const Message = require('bitcore-message')

function generateKey () {
  let privateKey = new bitcore.PrivateKey()
  let secretKeyWIF = privateKey.toWIF()
  let publicKey = privateKey.toPublicKey().toString()
  let address = privateKey.toAddress().toString()
  return {
    sk: secretKeyWIF,
    pubk: publicKey,
    address: address
  }
}

function checkSignature (address, message, signedmsg) {
  let verified = new Message(message).verify(address, signedmsg)
  if (verified === true) {
    return true
  }
  return false
}
module.exports = {
  generateKey: generateKey,
  checkSignature: checkSignature
}
