const uploadFile = require("../middleware/multer");
const ArweaveApi = require("../api/arweave-api");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";

const ParseUtil = require("../utils/parse");

const axios = require("axios");
const ethereumJsUtil = require("ethereumjs-util");

const protocolUpload = async (req, res) => {
  console.log(`Protocol endpoint reached `);

  try {
    //await uploadFile(req, res);
    console.log(req.body);
    //console.log( "------" );
    //const posted = JSON.parse(req.body);
    const posted = req.body;

    console.log(posted);

    if (posted.apiKey != "5e540544-4ef6-4cba-896a-322a56f50864") {
      return res.status(401).send({
        message: "You are not authorized!",
      });
    }

    if (posted.tags == undefined || posted.tags.length == 0) {
      return res.status(401).send({
        message: "You need tags! In json form!",
      });
    }

    // Make sure the user uploaded a file
    if (posted.data == undefined || posted.data.length == 0) {
      return res.status(400).send({
        message: "Need data to upload!",
      });
    }

    // Get the wallet we have stored locally
    let walletFile = fs.readFileSync(
      "C:/darkblock/arweave-key-fmTpIBFrCbAyUjV-f3VOq7Szs5RaMovb1Pf9MlUnjVk.json"
    ); //to wallet file

    const arweaveWallet = JSON.parse(walletFile);

    //make the transaction
    var txid = await ArweaveApi.makeProtocolTransaction(arweaveWallet, posted);

    // We did it!
    res.status(200).send({
      message: "Transaction Completed: " + txid,
    });

    // If something goes wrong, send an error
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      message: `Could not complete the transaction:  ${err}`,
    });
  }
};

/**
 * @param  {request} req //request with file+tags in the body
 * @param  {} res
 * Uploads the file, takes data from the request, encrypts the file,
 * attaches the tags and make the transaction to arweave
 */
const upload = async (req, res) => {
  console.log(`Upload endpoint reached : `);

  try {
    await uploadFile(req, res);

    const tags = req.body;

    // Make sure the user uploaded a file
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!",
      });
    }

    // Get the wallet we have stored locally
    let walletFile = fs.readFileSync(
      "C:/Users/ksaji/Documents/arweave-wallet/3211c2fe-3157-4677-81c1-1488e47976dd.json"
    ); //to wallet file

    const arweaveWallet = JSON.parse(walletFile);

    //make the transaction
    await ArweaveApi.makeTransaction(arweaveWallet, tags, req.file);

    // We did it!
    res.status(200).send({
      message: "Transaction Completed : " + req.file.originalname,
    });

    // If something goes wrong, send an error
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      message: `Could not complete the transaction: ${req.file.originalname}. ${err}`,
    });
  }
};

/**
 * @param  {request} req //a post request with Nft-Id's(ids) in the body
 * @param  {} res
 * parses ids from the body, puts it in a query, hits arweave
 * api for verification, returns a string of nft-ids all the matches
 * seprarated by a comma
 */
const verifyNFTs = async (req, res) => {
  var arweaveQuery = await ParseUtil.getFullQuery(req);
  var matches = "";
  await ArweaveApi.verifyNFTsById(arweaveQuery).then((transactions) => {
    if (transactions.length > 0) {
      //extract 'field' [NFT-Id] from transactions.tags
      matches = ParseUtil.getIdOfMatches(transactions, "NFT-Id");
    } else {
      //no matches
    }
  });
  res.status(200).send(matches);
};

/**
 * @param  {request} req
 * @param  {} res
 * Lists all the files in the local upload directory
 */
const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

/**
 * @param  {request} req //request with name of the file as param
 * @param  {} res
 * downloads the file with provided name
 */
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const protocolTest = async (req, res) => {
  console.log(`Protocol Initializing`);

  const msg = "16258260890750xaeabae9c70afbf5ad6e223211dac498ab1603fb0";
  const signature =
    "0x38997d5f539cd858cd3de597b39c9936389553fb88688e23f8e3e3cb4a71dc3c4577f91f14580f8cd6c31f64b7dce3d3623f8728e32f6502261081d3c7b75ab91c";
  const account = "0xaeabae9c70afbf5ad6e223211dac498ab1603fb0";

  const msgHash = ethereumJsUtil.keccak256(Buffer.from(msg));
  // The rest is the same as above
  const signatureBuffer = signature;
  const signatureParams = ethereumJsUtil.fromRpcSig(signatureBuffer);
  const publicKey = ethereumJsUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethereumJsUtil.publicToAddress(publicKey);
  const address = ethereumJsUtil.bufferToHex(addressBuffer);

  console.log(address); // Prints my initial web3.eth.coinbase
};

// Export all ya need
module.exports = {
  upload,
  getListFiles,
  download,
  verifyNFTs,
  protocolTest,
  protocolUpload,
};
