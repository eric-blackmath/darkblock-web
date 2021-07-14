//fields we need for ui + logic
//{name, creator, owner, contract, token, }
import * as NodeApi from "../api/node-api";
import * as parser from "./parser";

/**
 * @param  {CreatedByMe} nfts
 * Maps nfts to locally used objects for consistency
 *
 *
 */

const NO_USERNAME_FOUND = "No Username";
const NULL_ADDRESS = "NullAddress";

export const getMappedNft = async (nft) => {
  var id = parser.getContractAndTokensDetails(nft);
  const verifyRes = await NodeApi.getDarkblockedNftFrom(id);

  const darkblockedNft = verifyRes.data;

  var nftId = "";
  var darkblockDescription = "";
  var dateCreated = "";
  var encryptionLevel = "";

  if (darkblockedNft) {
    //attach darblock data with it
    nftId = !darkblockedNft[0] ? "" : darkblockedNft[0].value;
    darkblockDescription = !darkblockedNft[1] ? "" : darkblockedNft[1].value;
    dateCreated = !darkblockedNft[2] ? "" : darkblockedNft[2].value;
    encryptionLevel = !darkblockedNft[3] ? "" : darkblockedNft[3].value;
  }
  // const nftId = darkblockedNft.data[0].name;
  // darkblockedNft.data[0].name
  // darkblockedNft.data[0].name
  // darkblockedNft.data[0].name

  console.log(`Mapper ${JSON.stringify(darkblockedNft.data)}`);

  var mappedNft = {
    name: getName(nft),
    creator: getCreator(nft),
    owner: getOwner(nft),
    contract: getContract(nft),
    token: getToken(nft),
    image: getImage(nft),
    edition: getEdition(nft),
    nft_description: getDescription(nft),
    darkblock_description: darkblockDescription,
    blockchain: nft.asset_contract.schema_name,
    is_darkblocked: darkblockedNft ? true : false,
    is_owned_by_user: checkIfNftOwnedByUser(nft),
    nftId: nftId,
    nft_date_created: nft.asset_contract.created_date,
    darkblock_date_created: dateCreated,
    encryptionLevel: encryptionLevel === "AES-256" ? "two" : "one",
  };

  // console.log(JSON.stringify(mappedNft));

  return mappedNft;
};

const checkIfNftOwnedByUser = (nft) => {
  const accountAddress = "0x1fa2e96809465732c49f00661d94ad08d38e68df";
  const loggedInAccount = localStorage.getItem("accountAddress");
  // console.log(`Account Address : ${loggedInAccount}`);
  // console.log(`Owner Address : ${nft.owner.address}`);
  // console.log(`Creator Address : ${nft.creator.address}`);

  //localStorage.getItem("accountAddress")
  if (nft.creator.address === accountAddress) {
    return true;
  } else {
    return false;
  }
};

//TODO need to optimize or find a work-around
const getIsDarkblocked = (darkblockedNfts, nft) => {
  return darkblockedNfts.includes(`${getContract(nft)}:${getToken(nft)}`);
};

const getContract = (nft) => {
  return nft.asset_contract.address;
};

const getImage = (nft) => {
  return nft.image_url;
};

const getToken = (nft) => {
  return nft.token_id;
};

const getName = (nft) => {
  if (!nft.name) {
    return nft.collection.name;
  }
  return nft.name;
};

const getDescription = (nft) => {
  if (!nft.description) {
    return "";
  }
  return nft.description;
};

const getOwner = (nft) => {
  if (nft.owner.user) {
    //got owner
    if (!nft.owner.user.username || nft.owner.user.username === "NullAddress") {
      //the username of owner is not set
      return "No Username";
    }
    return nft.owner.user.username;
  } else if (nft.creator.user) {
    //got creator
    if (
      !nft.creator.user.username ||
      nft.creator.user.username === "NullAddress"
    ) {
      //creator username not set
      return "No Username";
    }
    return nft.creator.user.username;
  } else {
    //no owner, no creator
    return "No Username";
  }
};

const getCreator = (nft) => {
  if (nft.creator.user) {
    //got creator
    if (
      !nft.creator.user.username ||
      nft.creator.user.username === "NullAddress"
    ) {
      //the username of owner is not set
      return "No Username";
    }
    return nft.creator.user.username;
  } else if (nft.owner.user) {
    //got owner
    if (!nft.owner.user.username || nft.owner.user.username === "NullAddress") {
      //owner username not set
      return "No Username";
    }
    return nft.owner.user.username;
  } else {
    //no owner, no creator
    return "No Username";
  }
};

const getEdition = (nft) => {
  if (!nft.asset_contract.nft_version) {
    return "1/1";
  }
  return nft.asset_contract.nft_version;
};
