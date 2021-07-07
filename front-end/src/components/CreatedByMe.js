import React from "react";
import "../App.scss";
import * as RaribleApi from "../api/rarible-api";
import * as OpenseaApi from "../api/opensea-api";
import * as NodeApi from "../api/node-api";
import NFTItemCreator from "./NftItemCreator";
import Pagination from "./Pagination";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";

export default function CreatedByMe() {
  const [nfts, setNfts] = useState([]);
  const [darkblockedNfts, setDarkblockedNfts] = useState([]);
  const [selectedNftIndex, setSelectedIndex] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const address = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const verifyNFTs = async (ids) => {
    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("ids", ids);

    try {
      const verifyRes = await NodeApi.verifyNFTs(data);
      //handle the response
      //check if we got any matches
      var matches = verifyRes.data;
      if (matches) {
        //here we have some matches : separate the ids by comma and compare with items
        var matchesArr = matches.split(",");
        setDarkblockedNfts(matchesArr);
        console.log(`Verify Response : ${JSON.stringify(matches)}`);
      }
    } catch (err) {
      //catch some errors here
      console.log(err);
    }
  };

  const getContractAndTokens = (nfts) => {
    var ids = "";

    for (let i = 0; i < nfts.length; i++) {
      ids += `"${nfts[i].asset.asset_contract.address}:${nfts[i].asset.token_id}",`;
    }
    return ids.substring(0, ids.length - 1);
  };

  const fetchData = async () => {
    var data = await OpenseaApi.getNftsCreatedByUser(address);

    if (data.length > 0) {
      console.log(`Total Nfts : ${data.length}`);

      //handle the nfts | extract data for the nft verification
      var idsString = getContractAndTokens(data);

      // await verifyNFTs(idsString);

      //we do the filtering here
      console.log(`In Created By Me Page`);

      const filteredData = filterNfts(data);
      setNfts(filteredData);
      setIsLoaded(true);
    }
  };

  const filterNfts = (nfts) => {
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
        filteredNfts.push(nfts[i]);
        console.log(`Nft Belongs in created by me`);
      }
    }
    return filteredNfts;
  };

  const selectionHandler = (nftIndex) => {
    //nft is selected
    setSelectedIndex(nftIndex);
    console.log(`NFT Selected : ${selectedNftIndex}`);
  };

  const checkIfDarkblocked = (contract, token) => {
    return darkblockedNfts.includes(`${contract}:${token}`);
  };

  // Pagination setup
  const indexOfLastNft = currentPage * postsPerPage;
  const indexOfFirstNft = indexOfLastNft - postsPerPage;
  const currentNftsMeta = nfts.slice(indexOfFirstNft, indexOfLastNft);
  // Change page
  var paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      {/* <button>Go to detailsView</button> */}
      {isLoaded ? (
        <ul className="list-group">
          {currentNftsMeta.map((listitem, index) => (
            <NFTItemCreator
              key={index}
              nft={nfts[nfts.indexOf(listitem)]}
              selectionHandler={selectionHandler}
              darkblocked={checkIfDarkblocked(
                nfts[nfts.indexOf(listitem)].asset.asset_contract.address,
                nfts[nfts.indexOf(listitem)].asset.token_id
              )}
            />
          ))}
        </ul>
      ) : (
        <label>Loading</label>
      )}

      {nfts.length > 10 ? (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={nfts.length}
          paginate={paginate}
        />
      ) : null}
    </React.Fragment>
  );
}
