import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import * as Filter from "../util/filter";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as CreatedByMeMapper from "../util/createdbyme-mapper";
import NFTItem from "./NftItem";
import loadingblock from "../images/loadingblock.svg";
import Footer from "../components/footer";

var tempNfts = [];

export default function CreatedByMe() {
  const [nfts, setNfts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [hasMore, setHasMore] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const address = useContext(UserContext);
  const { account } = useParams();

  useEffect(() => {
    // console.log(`Arweave path : ${process.env.REACT_APP_ARWEAVE_WALLET_PATH}`);

    try {
      fetchData(currentPage);
    } catch (e) {
      console.log(e);
    }
  }, [account, address, currentPage]);

  const observer = useRef();
  const lastNftRef = useCallback(
    (node) => {
      if (!isLoaded) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log(`Reached the end`);
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoaded, hasMore]
  );

  const fetchData = async (pageNumber) => {
    // console.log(`Passed Arg : ${account}`);
    setIsLoaded(false);

    var accountAddress = address;
    if (account) {
      accountAddress = account;
    }

    var data = await OpenseaApi.getNftsCreatedByUserForPage(
      pageNumber,
      accountAddress
    );

    if (data !== undefined && data.length > 0) {
      // console.log(`CreatedByMe Total Nfts : ${data.length}`);

      if (data.length < 50) {
        setHasMore(false);
      }

      //do the filtering here
      const filteredData = Filter.filterNftsForCreatedByMe(data); //we need to filter the entire updated list
      const mappedNfts = await CreatedByMeMapper.getMappedList(filteredData);

      console.log(
        `Page : ${currentPage} | Reuqest Size : ${data.length} | Request-Filtered-Nfts : ${filteredData.length} | Nfts-In-List : ${nfts.length}`
      );
      // tempNfts = [...tempNfts, ...mappedNfts];

      // console.log(`TempNfts : ${tempNfts.length}`);

      // if (tempNfts.length > 8) {
      //   //this needs work
      //   tempNfts = tempNfts.slice(0, 7);
      // }

      // if (tempNfts.length < 8 && data.length === 8) {
      //   setCurrentPage(currentPage + 1);
      // }

      // if (tempNfts.length >= 8 || data.length < 8) {
      //   setData();
      // }

      const updatedNfts = [...nfts, ...mappedNfts];

      const filteredFullList = Filter.removeDupesFromMapped(updatedNfts);

      if (filteredFullList.length === nfts.length && data.length === 50) {
        //
        console.log(`No Nft added to the list after filtering, currentPage++`);
        setCurrentPage(currentPage + 1);
      } else {
        console.log(
          `Final Nfts Added : ${filteredFullList.length - nfts.length}`
        );
        setNfts(filteredFullList);
        setIsLoaded(true);
      }

      console.log(
        `Final Nfts Count : ${
          nfts.length + filteredFullList.length - nfts.length
        }`
      );
    } else {
      console.log(`No data returned in the request to opensea`);
      if (currentPage === 1) {
        setHasMore(false);
        setNoNftsFound(true);
        setIsLoaded(true);
      }
    }

    if (data !== undefined) {
      // console.log(`CreatedByMe Total Nfts : ${nfts.length}`);
      // http://localhost:3000/nfts/created/0x60ded964eacf12818b6896076375fe4c9e78e65d
      //do the filtering here
    }
  };

  const setData = () => {
    tempNfts = [];
  };

  const getNftsFor = async (pageNumber, accountAddress) => {
    console.log(`Passed Arg : ${account}`);

    var data = await OpenseaApi.getNftsCreatedByUserForPage(
      pageNumber,
      accountAddress
    );

    if (data !== undefined && data.length > 0) {
      console.log(`CreatedByMe Total Nfts : ${data.length}`);

      //do the filtering here
      const filteredData = Filter.filterNftsForCreatedByMe(data);
      const mappedNfts = await CreatedByMeMapper.getMappedList(filteredData);
      return mappedNfts;
    } else {
      return [];
    }
  };

  // Pagination setup
  // const indexOfLastNft = currentPage * postsPerPage;
  // const indexOfFirstNft = indexOfLastNft - postsPerPage;
  // const currentNftsMeta = nfts.slice(indexOfFirstNft, indexOfLastNft);
  // Change page
  var paginate = (pageNumber) => setCurrentPage(currentPage + 1);

  return (
    <React.Fragment>
      {/* <button>Go to detailsView</button> */}
      <div className="list-height">
        <ul className="list-group">
          {nfts.map((nft, index) => {
            if (nfts.length === index + 1) {
              return (
                <NFTItem
                  key={index}
                  nft={nfts[nfts.indexOf(nft)]}
                  innerRef={lastNftRef}
                />
              );
            } else {
              return <NFTItem key={index} nft={nfts[nfts.indexOf(nft)]} />;
            }
          })}
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

      {hasMore === true && isLoaded === true ? (
        <button onClick={(e) => paginate(e)}>Load More</button>
      ) : null}

      <Footer />
    </React.Fragment>
  );
}
