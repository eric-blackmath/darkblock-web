const formidable = require("formidable");

/**
 * @param  {request} req
 * parses the data (ids) from the request,
 * attaches and return with full query
 * ! since we only want the matching NFT-Id's, it constructs query for just that
 */
const getFullQuery = async (req) => {
  const field = "NFT-Id";
  var form = new formidable.IncomingForm();
  var formfields = await new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve(fields);
    }); // form.parse
  });

  return `query {\n transactions(\n tags: { name: "${field}", values: [${formfields.ids}] }\n ) {\n edges {\n node {\n id tags {name value}\n }\n }\n }\n}\n`;
};

/**
 * @param  {request} req
 * parses and returns the data (signature, data, address) from the request,
 *
 */
const getDataForSignatureVerification = async (req) => {
  var form = new formidable.IncomingForm();
  var formfields = await new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve(fields);
    }); // form.parse
  });

  return formfields;
};

/**
 * @param  {Transaction[]} transactions //nfts that are already darkblocked
 * @param  {string} field //field we wanna extract (NFT-Id)
 * TODO Maybe optimize it a little bit
 */
const getIdOfMatches = (transactions, field) => {
  var matches = "";
  for (let i = 0; i < transactions.length; i++) {
    var tags = transactions[i].node.tags;
    let result = tags.find((o) => o.name === field);
    matches += result.value + ",";
    console.log(`Transaction Match:${result.value}`);
  }
  return matches.substring(0, matches.length - 1);
};

/**
 * @param  {Transaction[]} transactions //nfts that are already darkblocked
 * @param  {string} fields //fields we wanna extract (NFT-Id)
 * TODO Maybe optimize it a little bit
 * extract fields from the matched transaction
 *
 */
const getMetaOfMatch = (transaction) => {
  //need id,description,date,level in that same order in arr
  const fields = ["NFT-Id", "Description", "Date-Created", "Encryption-Level"];

  var meta = [];
  var tags = transaction.node.tags;

  //we need custom field names to avoid dealing with symbols on the front
  fields.forEach((element) => {
    let fieldFound = tags.find((o) => o.name === element);
    meta.push(fieldFound);
  });
  // let nftId = tags.find((o) => o.name === fields[0]);
  // meta.push(nftId);
  // let description = tags.find((o) => o.name === fields[1]);
  // meta.push(description);
  // let dateCreated = tags.find((o) => o.name === fields[2]);
  // meta.push(dateCreated);
  // let encryptionVersion = tags.find((o) => o.name === fields[3]);
  // meta.push(encryptionVersion);

  console.log(`Transaction Match:${meta[0].name}`);
  console.log(`Transaction Match:${meta[0].value}`);

  return meta;
};

module.exports = {
  getFullQuery,
  getIdOfMatches,
  getDataForSignatureVerification,
  getMetaOfMatch,
};
