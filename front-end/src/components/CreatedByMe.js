import React from "react";
import "../App.scss";
import * as RaribleApi from "../api/rarible-api";
import * as OpenseaApi from "../api/opensea-api";
import * as NodeApi from "../api/node-api";
import NFTItemCreator from "./NftItemCreator";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

export default function CreatedByMe() {
  const [nfts, setNfts] = useState([]);
  const [darkblockedNfts, setDarkblockedNfts] = useState([]);
  const [selectedNftIndex, setSelectedIndex] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const address = useContext(UserContext);
  const { account } = useParams();

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

    console.log(`Fitlered Length : ${nfts.length}`);

    for (let i = 0; i < nfts.length; i++) {
      console.log(`Crashed at : ${i} : ${nfts[i].asset.name}`);
      ids += `"${nfts[i].asset.asset_contract.address}:${nfts[i].asset.token_id}",`;
    }
    return ids.substring(0, ids.length - 1);
  };

  const fetchData = async () => {
    console.log(`Passed Arg : ${account}`);
    var accountAddress = address;
    if (account) {
      accountAddress = account;
    }
    var data = await OpenseaApi.getNftsCreatedByUser(accountAddress);

    if (data.length > 0) {
      console.log(`Total Nfts : ${data.length}`);

      //we do the filtering here
      console.log(`In Created By Me Page`);

      const filteredData = filterNfts(data);
      //handle the nfts | extract data for the nft verification
      var idsString = getContractAndTokens(filteredData);
      await verifyNFTs(idsString);
      setNfts(filteredData);
      setIsLoaded(true);
    } else {
      console.log(`No Nfts Found`);
      setNoNftsFound(true);
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
        //check for collections vs assets
        if (
          !nfts[i].asset &&
          nfts[i].asset_bundle &&
          nfts[i].asset_bundle.assets !== undefined &&
          nfts[i].asset_bundle.assets.length != 0
        ) {
          //take out the assets from the collection
          //put in asset property for uniformity, attach them to filteredNfts
          console.log(`This one is a collection : ${i}`);
          console.log(
            `Assets inside collection length: ${nfts[i].asset_bundle.assets.length}`
          );
          //skip over it
          // for (let j = 0; j < nfts[i].asset_bundle.assets.length; j++) {
          //   //separate the assets and add em to filteredNfts

          //   nfts[i].asset_bundle.assets[j].asset =
          //     nfts[i].asset_bundle.assets[j];
          //   filteredNfts.push(nfts[i].asset_bundle.assets[j]);
          // }
        } else {
          //its an asset
          filteredNfts.push(nfts[i]);
        }

        // console.log(`Nft Belongs in created by me`);
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

      {isLoaded && noNftsFound ? (
        <div className="none-found">
          <h1>You have no NFTs in your wallet.</h1>
          <p className="none-found-p">
            Start by creating an NFT on any NFT minting site and then come back
            here to create a darkblock for that NFT
          </p>
        </div>
      ) : null}

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
