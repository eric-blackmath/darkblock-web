import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import * as Filter from "../util/filter";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import * as CreatedByMeMapper from "../util/createdbyme-mapper";
import NFTItem from "./NftItem";
import loadingblock from "../images/loadingblock.svg";
import Footer from "../components/footer";

export default function CreatedByMe() {
  const [nfts, setNfts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const address = useContext(UserContext);
  const { account } = useParams();

  useEffect(() => {
    console.log(`Arweave path : ${process.env.REACT_APP_ARWEAVE_WALLET_PATH}`);
    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const fetchData = async () => {
    console.log(`Passed Arg : ${account}`);
    var accountAddress = address;
    if (account) {
      accountAddress = account;
    }
    var data = await OpenseaApi.getAllNftsCreatedByUser(accountAddress);

    if (data !== undefined && data.length > 0) {
      console.log(`Total Nfts : ${data.length}`);
      if (data.length < 8) {
        setPostsPerPage(data.length);
      }

      //do the filtering here
      const filteredData = Filter.filterNftsForCreatedByMe(data);
      const mappedNfts = await CreatedByMeMapper.getMappedList(filteredData);
      setNfts(mappedNfts);
      setIsLoaded(true);
    } else {
      setNoNftsFound(true);
      setIsLoaded(true);
    }
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
        <div className="list-height">
        <ul className="list-group">
          {currentNftsMeta.map((listitem, index) => (
            <NFTItem key={index} nft={nfts[nfts.indexOf(listitem)]} />
          ))}
        </ul>
        </div>

      ) : (
        <div className="list-group">
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
          <div>
            <img src={loadingblock} alt="loading" />
          </div>
        </div>
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

      {nfts.length > 8 ? (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={nfts.length}
          paginate={paginate}
        />
      ) : null}
      <Footer />
    </React.Fragment>
  );
}
