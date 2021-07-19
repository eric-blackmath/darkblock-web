import axios from "axios";

const dummy_account = "0x1fa2e96809465732c49f00661d94ad08d38e68df";

//fetches nfts associated to accountAddress
export const getNfts = (accountAddress, offset) => {
  //pagination query : &offset=0&limit=20
  //event_type=created&
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=50&owner=${accountAddress}`,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data.assets)
    .catch(function (error) {
      console.log(error);
    });
};

//fetches nfts associated to accountAddress
export const getAllNfts = async (accountAddress) => {
  //pagination query : &offset=0&limit=20

  var offset = 0;
  var allNfts = [];

  //hit the api (with updated offset) as long as we are getting the max nfts
  do {
    var tempNfts = await getNfts(accountAddress, offset);
    console.log(`Do : ${tempNfts.length}`);
    offset += 50;
    tempNfts.forEach((element) => {
      allNfts.push(element);
    });
  } while (tempNfts.length === 50);
  console.log(`All Nfts Length = ${allNfts.length}`);

  return allNfts;
};

//fetches nfts associated to accountAddress, created by user
export const getNftsCreatedByUser = (accountAddress) => {
  //pagination query : &offset=0&limit=20
  //event_type=created&
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/events?account_address=${accountAddress}&only_opensea=false&limit=300
    `,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data.asset_events)
    .catch(function (error) {
      console.log(error);
    });
};

//fetches nfts associated to accountAddress
export const getSingleNft = (contract, tokenId) => {
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/assets?asset_contract_address=${contract}&token_ids=${tokenId}`,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data)
    .catch(function (error) {
      console.log(error);
    });
};
