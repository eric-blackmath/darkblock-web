import axios from "axios";

const dummy_account = "0x1fa2e96809465732c49f00661d94ad08d38e68df";

//fetches nfts associated to accountAddress
export const getNfts = (accountAddress) => {
  //pagination query : &offset=0&limit=20
  //event_type=created&
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=300&owner=${accountAddress}`,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data.assets)
    .catch(function (error) {
      console.log(error);
    });
};

<<<<<<< HEAD
=======
//fetches nfts associated to accountAddress
export const getNfts2 = (accountAddress) => {
  //pagination query : &offset=0&limit=20
  //event_type=created&

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(
    `https://api.opensea.io/api/v1/events?account_address=${accountAddress}&event_type=created&only_opensea=false&limit=300`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.asset_events)
    .catch((error) => console.log("error", error));

  // var config = {
  //   method: "get",
  //   url: `https://api.opensea.io/api/v1/events?account_address=${dummy_account}&event_type=created&only_opensea=false&limit=300`,
  //   headers: {},
  // };

  // return axios(config)
  //   .then((response) => response.data.asset_events)
  //   .catch(function (error) {
  //     console.log(error);
  //   });
};

>>>>>>> 9f1aeeb47ce8cd0d98f231c5c645e234d9306764
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
