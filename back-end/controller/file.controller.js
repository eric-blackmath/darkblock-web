const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";
const Arweave = require("arweave");
const formidable = require("formidable");

// Initialize arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  logging: true,
});

// Upload file and make the transaction endpoint
const upload = async (req, res) => {
  console.log(`Upload endpoint reached : `);

  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`${JSON.stringify(fields)}`);
    console.log(`${fields["contract"]}`);
    console.log(`${fields["token"]}`);
    console.log(`${fields["wallet"]}`);
  });
  // try {
  //   await uploadFile(req, res);

  //   // Make sure the user uploaded a file
  //   if (req.file == undefined) {
  //     return res.status(400).send({
  //       message: "Please upload a file!",
  //     });
  //   }

  //   // Get the data from the file we have uploaded
  //   let data = fs.readFileSync(req.file.path); //this is being uploaded

  //   // Get the wallet we have stored locally
  //   let walletFile = fs.readFileSync(
  //     "C:/Users/ksaji/Documents/arweave-wallet/3211c2fe-3157-4677-81c1-1488e47976dd.json"
  //   ); //to wallet file
  //   wallet = JSON.parse(walletFile);

  //   // Create a transaction and send it off to arweave
  //   let transaction = await arweave.createTransaction(
  //     {
  //       data: data,
  //     },
  //     wallet
  //   );

  //   //in params we have to receive:
  //   //nft-contract, eth-wallet-address, tokenId,
  //   transaction.addTag("NFT-Contract", "contract-number");
  //   transaction.addTag("NFT-Creator", "eth-wallet-address");
  //   transaction.addTag("Token-Id", "tokenId-Nft");
  //   transaction.addTag("NFT-Id", "secondOne");
  //   transaction.addTag("Platform", "Ethereum ERC-721");
  //   transaction.addTag("Authorizing-Signature", "TBD");
  //   transaction.addTag("ArtId", "TBD");
  //   transaction.addTag("Encryption-Level", "None");
  //   transaction.addTag("Creator-App", "Darkblock");
  //   transaction.addTag("Content-Type", "image");
  //   // transaction.addTag("owner", "text/html");
  //   // Wait for arweave to sign it and give us the ok
  //   await arweave.transactions.sign(transaction, wallet);

  //   //we need to use chunk uploading here, to catch use cases like interruptions, resuming
  //   const response = await arweave.transactions.post(transaction);

  //   console.log(`Transaction Post Response : ${JSON.stringify(response.data)}`);
  //   // console.log(`Transaction : ${JSON.stringify(transaction)}`);

  //   // We did it!
  //   res.status(200).send({
  //     message: "Uploaded the file successfully: " + req.file.originalname,
  //   });

  //   // If something goes wrong, send an error
  // } catch (err) {
  //   res.status(500).send({
  //     message: `Could not upload the file: ${req.file.originalname}. ${err}`,
  //   });
  // }
};

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

const verifyNFTs = (req, res) => {
  //get and parse the ids from request
  //make a request to arweave
  //parse the request
  //send the matching id's to the front

  var resJson = {
    1: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430:345559",
    2: "0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:5",
    3: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430:458892",
    4: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430:520245",
  };

  console.log(`Verifying id's`);
  res.status(200).send(resJson);
};

// Export all ya need
module.exports = {
  upload,
  getListFiles,
  download,
  verifyNFTs,
};
