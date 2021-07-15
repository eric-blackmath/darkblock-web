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
      if (!nfts[i].asset) {
        //skip over the collections
        console.log(`This one is a collection : ${i}`);
        continue;
      }
      filteredNfts.push(nfts[i]);
    }
    // console.log(nfts[i].asset.name);
  }

  console.log(`filteredNfts : ${filteredNfts.length}`);

  //take care of duplicates
  var uniqueNfts = [...new Set(filteredNfts)];

  console.log(`uniqueNfts : ${uniqueNfts.length}`);

  return filteredNfts;
};
