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
    // Get the data from the file we have uploaded
    let data = fs.readFileSync(req.file.path); //this is being uploaded

    // Get the wallet we have stored locally
    let walletFile = fs.readFileSync(
      "C:/Users/ksaji/Documents/arweave-wallet/3211c2fe-3157-4677-81c1-1488e47976dd.json"
    ); //to wallet file

    const arweaveWallet = JSON.parse(walletFile);

    //make the transaction
    await ArweaveApi.makeTransaction(arweaveWallet, data, tags);

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

// Export all ya need
module.exports = {
  upload,
  getListFiles,
  download,
  verifyNFTs,
};
