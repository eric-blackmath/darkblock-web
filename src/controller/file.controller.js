const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";
const Arweave = require('arweave');

// Initialize arweave
const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "http",
  logging: true,
});

// Upload file endpoint
const upload = async (req, res) => {

  console.log("Upload endpoint reached");

  try {
    await uploadFile(req, res);

    // Make sure the user uploaded a file
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!"
      });
    }

    // Get the data from the file we have uploaded
    let data = fs.readFileSync(req.file.path); //this is being uploaded

    // Get the wallet we have stored locally
    let walletFile = fs.readFileSync(
      "C:/Users/Scima/Downloads/arweave-key-JxRiV4nzg46XiKVZrvVbirHI3VWKjtAbIGPoBgKSD4w.json"
    ); //to wallet file
    wallet = JSON.parse(walletFile);

    // Create a transaction and send it off to arweave
    console.log(2);
    let transaction = await arweave.createTransaction({
      data: data
    }, wallet);
    transaction.addTag("Content-Type", "image/jpeg");

    // Wait for arweave to sign it and give us the ok
    await arweave.transactions.sign(transaction, wallet);

    const response = await arweave.transactions.post(transaction);
    console.log(response.status);

    // We did it!
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });

    // If something goes wrong, send an error
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

// Export all ya need
module.exports = {
  upload,
  getListFiles,
  download,
};