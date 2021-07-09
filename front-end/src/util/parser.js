export const getContractAndTokens = (nfts) => {
  var ids = "";
  for (let i = 0; i < nfts.length; i++) {
    ids += `"${nfts[i].asset_contract.address}:${nfts[i].token_id}",`;
  }
  return ids.substring(0, ids.length - 1);
};

export const getContractAndTokensDetails = (nft) => {
  var ids = "";

  ids += `"${nft.asset_contract.address}:${nft.token_id}",`;

  return ids.substring(0, ids.length - 1);
};
