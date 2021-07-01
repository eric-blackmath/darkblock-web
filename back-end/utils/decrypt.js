const CryptoJS = require("crypto-js");
const keyGen = require("./key-gen");

var iterationCount = 1000;
var keySize = 128 / 32;

const decryptResponse = (key, response) => {
  var genKey = keyGen.generateKey(keyGen.salt, key);
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(response),
  });
  var decrypted = CryptoJS.AES.decrypt(cipherParams, genKey, {
    iv: CryptoJS.enc.Hex.parse(keyGen.iv),
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  decryptResponse,
};
