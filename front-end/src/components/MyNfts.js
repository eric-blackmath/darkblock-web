import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import NFTItem from "./NftItem";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import * as MyNftsMapper from "../util/my-nfts-mapper";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import loadingblock from "../images/loadingblock.svg";
import Footer from "../components/footer";

export default function MyNfts() {
  const [nfts, setNfts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  const observer = useRef();
  const lastNftRef = useCallback(
    (node) => {
      if (!isLoaded) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log(`Reached the end`);
          setTimeout(function () {
            setCurrentPage((prev) => prev + 1);
          }, 750);
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
    var data = await OpenseaApi.getNftsForPage(pageNumber, accountAddress);

    if (data !== undefined && data.length > 0) {
      // if (data.length < 8) {
      //   setPostsPerPage(data.length);
      // }

      //hide the button if we get data less than 8

      if (data.length < 50) {
        setHasMore(false);
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
      setHasMore(false);
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

      <Footer />
    </React.Fragment>
  );
}
