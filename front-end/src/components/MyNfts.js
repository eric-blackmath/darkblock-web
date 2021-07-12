import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import * as NodeApi from "../api/node-api";
import NFTItem from "./NftItem";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import * as parser from "../util/parser";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

export default function MyNfts() {
  const [nfts, setNfts] = useState([]);
  const [darkblockedNfts, setDarkblockedNfts] = useState([]);
  const [selectedNftIndex, setSelectedIndex] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const address = useContext(UserContext);
  const { account } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      console.log(`Passed Arg : ${account}`);
      var accountAddress = address;
      if (account) {
        accountAddress = account;
      }
      var data = await OpenseaApi.getNfts(accountAddress);

      if (data.length > 0) {
        console.log(`Data : ${data.length}`);
        //for pagination, if data is less than 10, we dont want pagination
        if (data.length < 8) {
          setPostsPerPage(data.length);
        }
        //handle the nfts | extract data for the nft verification
        var idsString = parser.getContractAndTokens(data);
        await verifyNFTs(idsString);
        setNfts(data);
        setIsLoaded(true);
      } else {
        console.log(`No Nfts Found`);
        setNoNftsFound(true);
        setIsLoaded(true);
      }
    };

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
                nfts[nfts.indexOf(listitem)].asset_contract.address,
                nfts[nfts.indexOf(listitem)].token_id
              )}
            />
          ))}
        </ul>
      ) : (
        <label>Loading</label>
      )}

      {isLoaded && noNftsFound ? <div>No NFTS Found</div> : null}

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
