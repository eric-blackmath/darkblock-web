const uploadFile = require("../middleware/multer");
const ArweaveApi = require("../api/arweave-api");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";

const ParseUtil = require("../utils/parse");

/**
 * @param  {request} req //request with file+tags in the body
 * @param  {} res
 * Uploads the file, takes data from the request, encrypts the file,
 * attaches the tags and make the transaction to arweave
 */
const protocolUpload = async (req, res) => {
  console.log(`Protocol endpoint reached `);

  try {
    //await uploadFile(req, res);

    const posted = JSON.parse(req.body.text);

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
    let walletFile = fs.readFileSync("C:/darkblock/burn arweave wallet.json"); //to wallet file

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
      console.log(`Ids in Controller : ${matches}`);
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

  const wallet = "0xbc355f371084200cd177131154ca8829fba0e623";
  const artId = "ad57fdc4-baf6-4714-ad23-eaadbcbc0a72";

  const msgParams = [
    {
      type: "string", // Any valid solidity type
      name: "Message", // Any string label you want
      value: "Hi, Alice!", // The value to sign
    },
    {
      type: "uint32",
      name: "A number",
      value: "1337",
    },
  ];

  // web3.eth.getAccounts(console.log);

  // var msgHash = ethUtil.keccak256(artId);

  // web3.eth.sign(wallet, msgHash, function (err, result) {
  //   if (err) return console.error(err);
  //   console.log("SIGNED:" + result);
  // });
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
