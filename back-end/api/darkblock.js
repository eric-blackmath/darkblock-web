const axios = require("axios");
var querystring = require("querystring");

//getRSAPublicKey
//main Request -Post that'd give us {artID, aesKey, rsapublicKey}

const getEncryptionParameters = async (artId, signature, wallet, encAes) => {
  return axios
    .post(
      "http://dev1.darkblock.io:5050/keygen",
      querystring.stringify({
        artid: artId, //gave the values directly for testing
        signature: signature,
        wallet: wallet,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          aesKey: encAes,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getRSAPublicKey = () => {
  return axios
    .get("http://dev1.darkblock.io:5050/getrsapublickey")
    .then((res) => res.data);
};

module.exports = {
  getEncryptionParameters,
  getRSAPublicKey,
};
