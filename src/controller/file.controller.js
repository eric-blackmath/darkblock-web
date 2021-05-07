const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";
// const Arweave = require('arweave');

 
// const arweave = Arweave.init({
//   host: "arweave.net",
//   port: 1984,
//   protocol: "http",
// });

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    // put arweave stuff then delete itself, same directory path
    let walletFile = fs.readFileSync(
      "C:/Users/eflat/Documents/arweave-wallet/arweave-key-JxRiV4nzg46XiKVZrvVbirHI3VWKjtAbIGPoBgKSD4w.json"
    ); //to wallet file
    wallet = JSON.parse(walletFile);
    key = await arweave.wallets.jwkToAddress(wallet);

    let data = fs.readFileSync(
      "C:/Users/eflat/darkblock-react/resources/static/assets/uploads/cursor.png"
    ); //this is being uploaded
    let transaction = await arweave.createTransaction({ data: data }, key);
    transaction.addTag("Content-Type", "image/jpeg");
    // transaction.addTag('Content-Type', 'application/pdf');
    await arweave.transactions.sign(transaction, key);

    const response = await arweave.transactions.post(transaction);
    console.log(response.status);

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
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

module.exports = {
  upload,
  getListFiles,
  download,
};
