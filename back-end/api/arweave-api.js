const axios = require("axios");
const Arweave = require("arweave");
const protocolUtil = require("../utils/protocol-util");
const encrypt = require("../utils/encrypt");
const artIdUtil = require("../utils/art-id");
const mime = require("mime-types");
const fs = require("fs");

//uuidv4(); - will generate a v4 uuid

// Initialize arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  logging: true,
});

/**
 * @param  {string} arweaveWallet
 * @param  {file} data
 * @param  {string[]} tags
 * encrypts the data, attaches tags with data, and post the transaction to the arweave
 * api for the wallet(arweave)
 *
 */
const makeTransaction = async (arweaveWallet, tags, file) => {
  // Get the data from the file we have uploaded

  var isEncryptionOn = tags.encryption === "true";

  let data;
  let encryptionKeys;
  let artId;

  console.log(`Encryption : ${isEncryptionOn}`);

  if (isEncryptionOn === true) {
    let fileContents = fs.readFileSync(file.path, { encoding: "base64" });
    encryptionKeys = await protocolUtil.getEncryptionKeys(
      tags.wallet,
      "sign123"
    );
    //encrypt the data
    data = await encrypt.encryptData(fileContents, encryptionKeys.aesKey);
  } else {
    artId = artIdUtil.generateArtId();
    data = fs.readFileSync(file.path);
  }

  //gives us mime type for ext
  const contentType = mime.lookup(file.originalname);

  // Create a transaction
  let transaction = await arweave.createTransaction(
    {
      data: isEncryptionOn === true ? data + "" : data,
    },
    arweaveWallet
  );

  //in params we have to receive:
  //nft-contract, eth-wallet-address, tokenId,
  transaction.addTag("NFT-Contract", tags.contract);
  transaction.addTag("NFT-Creator", tags.wallet);
  transaction.addTag("Token-Id", tags.token);
  transaction.addTag("NFT-Id", `${tags.contract}:${tags.token}`);
  transaction.addTag("Platform", "Ethereum ERC-721");
  transaction.addTag("Authorizing-Signature", "TBD");
  transaction.addTag(
    "ArtId",
    isEncryptionOn === true ? encryptionKeys.artid : artId
  );
  transaction.addTag(
    "Encryption-Level",
    isEncryptionOn === true ? "AES-256" : "None"
  );
  transaction.addTag("Creator-App", "Darkblock");
  transaction.addTag(
    "Content-Type",
    isEncryptionOn === true ? `encrypted(${contentType})` : contentType
  );
  transaction.addTag(
    "RSA-Public",
    isEncryptionOn === true ? encryptionKeys.rsaPublicKey : "None"
  );
  transaction.addTag("Transaction-Type", "Test-Debug");
  if (isEncryptionOn === true) transaction.addTag("Encryption-Version", "0.1");

  // Wait for arweave to sign it and give us the ok
  await arweave.transactions.sign(transaction, arweaveWallet);

  //we need to use chunk uploading here, to catch use cases like interruptions, resuming
  const response = await arweave.transactions.post(transaction);

  console.log(`Transaction Response : ${JSON.stringify(response.data)}`);

  //TODO
  //responses
  /*		200: OK
			OK
		208: Already Reported
			The transaction has already been submitted.
			Transaction already processed.
		400: Bad Request
			The transaction is invalid, couldn't be verified, or the wallet does not have suffucuent funds.
			Transaction verification failed.
		429: Too Many Requests
			The request has exceeded the clients rate limit quota.
			Too Many Requests
		503: Service Unavailable
			The nodes was unable to verify the transaction.
			Transaction verification failed.
		*/
};

/**
 * @param  {string} queryArweave //full query containing ids
 * makes a get request to the arweave/graphql endopint with the query
 * and returns the transactions which matches
 */
const verifyNFTsById = (queryArweave) => {
  const URL = `https://arweave.net/graphql`;

  return axios(
    URL,
    {
      params: {
        query: queryArweave,
      },
    },
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  )
    .then((response) => response.data.data.transactions.edges)
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  verifyNFTsById,
  makeTransaction,
};
