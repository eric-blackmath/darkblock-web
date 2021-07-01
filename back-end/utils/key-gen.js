const CryptoJS = require("crypto-js");

var iterationCount = 1000;
var keySize = 128 / 32;
var iv = "dc0da04af8fee58593442bf834b30739";
var salt = "dc0da04af8fee58593442bf834b30739";

function generateKey(salt, passPhrase) {
  var key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    keySize: keySize,
    iterations: iterationCount,
  });
  return key;
}

module.exports = {
  generateKey,
  iv,
  salt,
};
