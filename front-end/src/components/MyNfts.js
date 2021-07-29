import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import NFTItem from "./NftItem";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import * as MyNftsMapper from "../util/my-nfts-mapper";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import loadingblock from "../images/loadingblock.svg";
import Footer from "../components/footer";

export default function MyNfts() {
  const [nfts, setNfts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const address = useContext(UserContext);
  const { account } = useParams();

  var accountAddress = "";

  useEffect(() => {
    try {
      fetchData(currentPage);

      // fetchAdditionalData();
    } catch (e) {
      console.log(e);
    }
  }, [account, address, currentPage]);

  const fetchData = async (pageNumber) => {
    // console.log(`Passed Arg : ${account}`);
    setIsLoaded(false);
    var accountAddress = address;
    if (account) {
      accountAddress = account;
    }
    var data = await OpenseaApi.getNftsForPage(pageNumber, accountAddress);

    if (data !== undefined && data.length > 0) {
      // if (data.length < 8) {
      //   setPostsPerPage(data.length);
      // }

      //hide the button if we get data less than 8

      if (data.length < 50) {
        setShowLoadMore(false);
      }

      console.log(
        `Created By Me After Filter For Page : ${currentPage} | Reuqest Size : ${data.length}`
      );

      //do the filtering here
      const mappedNfts = await MyNftsMapper.getMappedList(data);
      const updatedNfts = [...nfts, ...mappedNfts];
      setNfts(updatedNfts);
      setIsLoaded(true);
    } else {
      setShowLoadMore(false);
      setNoNftsFound(true);
      setIsLoaded(true);
    }
  };

  // Pagination setup
  // const indexOfLastNft = currentPage * postsPerPage;
  // const indexOfFirstNft = indexOfLastNft - postsPerPage;
  // const currentNftsMeta = nfts.slice(indexOfFirstNft, indexOfLastNft);
  // Change page
  var paginate = (e) => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <React.Fragment>
      {/* <button>Go to detailsView</button> */}
      <div>
        <ul className="list-group">
          {nfts.map((listitem, index) => (
            <NFTItem key={index} nft={nfts[nfts.indexOf(listitem)]} />
          ))}
        </ul>
      </div>

      {isLoaded === false ? (
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
      ) : null}

      {isLoaded === true && noNftsFound === true ? (
        <div className="none-found">
          <h1>You have no NFTs in your wallet.</h1>
          <p className="none-found-p">
            Start by creating an NFT on any NFT minting site and then come back
            here to create a darkblock for that NFT
          </p>
        </div>
      ) : null}

      {showLoadMore === true && isLoaded === true ? (
        <button onClick={(e) => paginate(e)}>Load More</button>
      ) : null}

      <Footer />
    </React.Fragment>
  );
}
