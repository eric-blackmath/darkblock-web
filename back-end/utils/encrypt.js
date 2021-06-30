const JSEncrypt = require("node-jsencrypt");
const CryptoJS = require("crypto-js");
const keyGen = require("./key-gen");

const encryptAES = (aesKey, rsaPublic) => {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(rsaPublic);
  return jsEncrypt.encrypt(aesKey);
};

const encryptData = (data, key) => {
  return CryptoJS.AES.encrypt(data, key).ciphertext.toString(
    CryptoJS.enc.Base64
  );
};

function encryptData2(passPhrase, plainText) {
  var key = keyGen.generateKey(keyGen.salt, passPhrase);
  var encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: CryptoJS.enc.Hex.parse(keyGen.iv),
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

module.exports = {
  encryptAES,
  encryptData,
  encryptData2,
};
