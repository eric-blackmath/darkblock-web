import React from "react";
import "../App.scss";
import * as RaribleApi from "../api/rarible-api";
import * as OpenseaApi from "../api/opensea-api";

import * as NodeApi from "../api/node-api";
import NFTItem from "./NftItem";
import Pagination from "./Pagination";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";

export default function Dashboard() {
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
    var data = await OpenseaApi.getNfts(address);
    console.log(`Total Nfts : ${data.length}`);

    if (data.length > 0) {
      //handle the nfts | extract data for the nft verification
      var idsString = getContractAndTokens(data);
      await verifyNFTs(idsString);
      setNfts(data);
      setIsLoaded(true);
    }

    //   //for pagination, if data is less than 10, we dont want pagination
    //   if (data.length < 8) {
    //     setPostsPerPage(data.length);
    //   }
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
            <NFTItem
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
