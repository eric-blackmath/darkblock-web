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
  return `query{transactions(tags:{name:"${field}",values:[${formfields.ids}]}){edges{node{id,tags{name,value}}}}}`;
};

/**
 * @param  {Transaction[]} transactions //nfts that are already darkblocked
 * @param  {string} field //field we wanna extract (NFT-Id)
 * TODO Maybe optimize it a little bit
 */
const getIdOfMatches = (transactions, field) => {
  var matches = "";
  transactions.forEach((transaction) => {
    var tags = transaction.node.tags;
    let result = tags.find((o) => o.name === field);
    matches += result.value + ",";
    console.log(`Transactions Arr Search:${result.value}`);
  });
  return matches;
};

module.exports = {
  getFullQuery,
  getIdOfMatches,
};
