const artId = require("./art-id");
const decrypt = require("../utils/decrypt");
const encrypt = require("../utils/encrypt");
const darkblock = require("../api/darkblock");
const aesUtil = require("../utils/aes-util");

const getEncryptionKeys = async (wallet, signature) => {
  const artIdGen = artId.generateArtId();
  const aesKey = aesUtil.generateAESKey();
  const rsaPublic = await darkblock.getRSAPublicKey();
  const encAes = encrypt.encryptAES(aesKey, rsaPublic);
  const reponse = await darkblock.getEncryptionParameters(
    artIdGen,
    signature,
    wallet,
    encAes
  );

  const decryptedResponse = decrypt.decryptResponse(aesKey, reponse);
  console.log(`Final Response : ${decryptedResponse}`);
  const decResJson = JSON.parse(decryptedResponse);
  return decResJson;
};

module.exports = {
  getEncryptionKeys,
};
