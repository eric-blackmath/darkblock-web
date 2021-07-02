import React from "react";
import "../App.scss";
import * as RaribleApi from "../api/rarible-api";
import * as NodeApi from "../api/node-api";
import NFTItem from "./NftItem";
import Pagination from "./Pagination";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";

export default function Dashboard({ address }) {
  const [nfts, setNfts] = useState([]);
  const [nftsMeta, setNftsMeta] = useState([]);
  const [darkblockedNfts, setDarkblockedNfts] = useState([]);
  const [selectedNftIndex, setSelectedIndex] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useContext(UserContext);

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
      ids += `"${nfts[i].contract}:${nfts[i].tokenId}",`;
    }
    return ids.substring(0, ids.length - 1);
  };

  const fetchData = async () => {
    var nftsMetaTemp = [];

    // await this.getUserProfile();

    const nftRes = await RaribleApi.getNfts(address);
    //handle the nfts | extract data for the nft verification
    var data = nftRes.items;

    if (data.length > 0) {
      //make sure we have nfts
      var idsString = getContractAndTokens(data);

      await verifyNFTs(idsString);

      console.log(`After Verification Mark`);
      //for pagination, if data is less than 10, we dont want pagination
      if (data.length < 8) {
        setPostsPerPage(data.length);
      }
      setNfts(data);

      for (var i = 0; i < data.length; i++) {
        var nftMetaRes = await RaribleApi.getNftMetaById(data[i].id);
        nftsMetaTemp.push(nftMetaRes);
        // if (nftsMetaTemp.length === 10) {
        //   setNftsMeta(nftsMetaTemp);
        // }
      }
      setNftsMeta(nftsMetaTemp);
      setIsLoaded(true);
    }
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
  const currentNftsMeta = nftsMeta.slice(indexOfFirstNft, indexOfLastNft);
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
              nft={nfts[nftsMeta.indexOf(listitem)]}
              nftMeta={listitem}
              user={user}
              nftIndex={index} //for selection of nft
              selectionHandler={selectionHandler}
              darkblocked={checkIfDarkblocked(
                nfts[nftsMeta.indexOf(listitem)].contract,
                nfts[nftsMeta.indexOf(listitem)].tokenId
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
          totalPosts={nftsMeta.length}
          paginate={paginate}
        />
      ) : null}
    </React.Fragment>
  );
}
