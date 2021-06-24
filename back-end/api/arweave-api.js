const axios = require("axios");
const Arweave = require("arweave");

// Initialize arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  logging: true,
});

const makeTransaction = async (arweaveWallet, data, tags) => {
  // Create a transaction and send it off to arweave
  let transaction = await arweave.createTransaction(
    {
      data: data,
    },
    arweaveWallet
  );

  //in params we have to receive:
  //nft-contract, eth-wallet-address, tokenId,
  transaction.addTag("NFT-Contract", tags.contract + "debug");
  transaction.addTag("NFT-Creator", tags.wallet + "debug");
  transaction.addTag("Token-Id", tags.token + "debug");
  transaction.addTag("NFT-Id", `${tags.contract}:${tags.token}debug`);
  transaction.addTag("Platform", "Ethereum ERC-721");
  transaction.addTag("Authorizing-Signature", "TBD");
  transaction.addTag("ArtId", "TBD");
  transaction.addTag("Encryption-Level", "None");
  transaction.addTag("Creator-App", "Darkblock");
  transaction.addTag("Content-Type", "image");

  // Wait for arweave to sign it and give us the ok
  await arweave.transactions.sign(transaction, arweaveWallet);

  //we need to use chunk uploading here, to catch use cases like interruptions, resuming
  const response = await arweave.transactions.post(transaction);

  console.log(`Transaction Response : ${JSON.stringify(response.data)}`);
};

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
