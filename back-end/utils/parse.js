const formidable = require("formidable");

//parses the data (ids) from the request, attaches and return with full query
const getFullQuery = async (req) => {
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
  return `query{transactions(tags:{name:"NFT-Id",values:[${formfields.ids}]}){edges{node{id,tags{name,value}}}}}`;
};

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
