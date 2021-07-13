//fields we need for ui + logic
//{name, creator, owner, contract, token, image}
import * as NodeApi from "../api/node-api";
import * as parser from "../util/parser";

/**
 * @param  {MyNfts} nfts
 * Maps nfts to locally used objects for consistency,
 *
 *
 */

const NO_USERNAME_FOUND = "No Username";
const NULL_ADDRESS = "NullAddress";

export const getMappedList = async (nfts) => {
  var ids = parser.getContractAndTokensFromMyNfts(nfts);
  const darkblockedNfts = await NodeApi.getDarkblockedNftsFrom(ids);
  var mappedNfts = [];
  for (let i = 0; i < nfts.length; i++) {
    //
    var nft = {
      name: getName(nfts[i]),
      creator: getCreator(nfts[i]),
      owner: getOwner(nfts[i]),
      contract: getContract(nfts[i]),
      token: getToken(nfts[i]),
      image: getImage(nfts[i]),
      is_darkblocked:
        darkblockedNfts !== undefined && darkblockedNfts.length > 0
          ? getIsDarkblocked(darkblockedNfts, nfts[i])
          : false,
    };
    mappedNfts.push(nft);
  }

  return mappedNfts;
};

//TODO need to optimize or find a work-around
const getIsDarkblocked = (darkblockedNfts, nft) => {
  return darkblockedNfts.includes(`${getContract(nft)}:${getToken(nft)}`);
};

const getContract = (nft) => {
  return nft.asset_contract.address;
};

const getImage = (nft) => {
  return nft.image_preview_url;
};

const getToken = (nft) => {
  return nft.token_id;
};

const getName = (nft) => {
  if (!nft.name) {
    return nft.collection.name;
  }
  return `${nft.name}`;
};

const getOwner = (nft) => {
  if (nft.owner.user) {
    //got owner
    if (!nft.owner.user.username || nft.owner.user.username === NULL_ADDRESS) {
      //the username of owner is not set
      return NO_USERNAME_FOUND;
    }
    return nft.owner.user.username;
  } else if (nft.creator.user) {
    //got from_account info
    if (
      !nft.creator.user.username ||
      nft.creator.user.username === NULL_ADDRESS
    ) {
      //creator username not set
      return NO_USERNAME_FOUND;
    }
    return nft.creator.user.username;
  } else {
    //no owner, no creator
    return NO_USERNAME_FOUND;
  }
};

const getCreator = (nft) => {
  if (nft.creator.user) {
    //got creator
    if (
      !nft.creator.user.username ||
      nft.creator.user.username === NULL_ADDRESS
    ) {
      //the username of creator is not set
      return NO_USERNAME_FOUND;
    }
    return nft.creator.user.username;
  } else if (nft.owner.user) {
    //got owner info
    if (!nft.owner.user.username || nft.owner.user.username === NULL_ADDRESS) {
      //owner username not set
      return NO_USERNAME_FOUND;
    }
    return nft.owner.user.username;
  } else {
    //no owner, no creator
    return NO_USERNAME_FOUND;
  }
};
