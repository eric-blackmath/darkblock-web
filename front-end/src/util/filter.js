export const filterNftsForCreatedByMe = (nfts) => {
  // if the event_type="created" OR event_type="transfer"
  //AND form_account.address is 0x0000000000000000000000000000000000000000
  var filteredNfts = [];
  for (let i = 0; i < nfts.length; i++) {
    if (
      nfts[i].event_type === "created" ||
      (nfts[i].event_type === "transfer" &&
        nfts[i].from_account.address ===
          "0x0000000000000000000000000000000000000000")
    ) {
      //check for collections vs assets
      // console.table(`Nft : ${JSON.stringify(nfts[i])}`);
      // console.log(
      //   `Nft : ${nfts[i].asset.asset_contract.address}:${nfts[i].asset.token_id}`
      // );

      if (!nfts[i].asset) {
        //skip over the collections
        console.log(`This one is a collection : ${i}`);
        continue;
      }
      filteredNfts.push(nfts[i]);
    }
  }

  var uniqueNfts = [];

  //filter out duplicates
  try {
    uniqueNfts = removeDupes(filteredNfts);
  } catch (e) {
    console.log(e);
  }
  return uniqueNfts;
};

export const removeDupes = (nfts) => {
  var uniqueArr = nfts.reduce(function (accumulator, current) {
    if (checkIfAlreadyExist(current)) {
      return accumulator;
    } else {
      return accumulator.concat([current]);
    }

    function checkIfAlreadyExist(currentVal) {
      return accumulator.some(function (item) {
        return (
          item.asset.asset_contract.address ===
            currentVal.asset.asset_contract.address &&
          item.asset.token_id === currentVal.asset.token_id
        );
      });
    }
  }, []);
  return uniqueArr;
};
