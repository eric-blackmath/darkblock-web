const CryptoJS = require("crypto-js");

const generateAESKey = () => {
  var password = "some random secret pass phrase";
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var keySize = 256 / 32;
  var ivSize = 128 / 32;
  var output = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize,
    iterations: ivSize,
  });
  console.log(`AES Key : ${output.toString(CryptoJS.enc.Base64)}`);
  return output.toString(CryptoJS.enc.Base64);
};

module.exports = {
  generateAESKey,
};
