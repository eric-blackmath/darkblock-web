import axios from "axios";

const dummy_account = "0x1fa2e96809465732c49f00661d94ad08d38e68df";

//fetches nfts associated to accountAddress
export const getNfts = (accountAddress) => {
  //pagination query : &offset=0&limit=20
  //event_type=created&
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/events?account_address=${dummy_account}&only_opensea=false&limit=60
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
