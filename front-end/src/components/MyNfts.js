import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import NFTItem from "./NftItem";
import Pagination from "./PaginationWrapper";
import { UserContext } from "../util/UserContext";
import * as MyNftsMapper from "../util/my-nfts-mapper";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import loadingblock from "../images/loadingblock.svg";

export default function MyNfts() {
  const [nfts, setNfts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const address = useContext(UserContext);
  const { account } = useParams();
  let location = useLocation();

  useEffect(() => {
    console.log(`Path Nav : ${location.pathname}`);

    const fetchData = async () => {
      console.log(`Passed Arg : ${account}`);
      var accountAddress = address;
      if (account) {
        accountAddress = account;
      }
      var data = await OpenseaApi.getNfts(accountAddress);

      if (data !== undefined && data.length > 0) {
        console.log(`Nfts : ${data.length}`);
        //for pagination, if data is less than 10, we dont want pagination
        if (data.length < 8) {
          setPostsPerPage(data.length);
        }
        const mappedNfts = await MyNftsMapper.getMappedList(data);
        setNfts(mappedNfts);
        setIsLoaded(true);
      } else {
        setNoNftsFound(true);
        setIsLoaded(true);
      }
    };

    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, []);

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
            <NFTItem key={index} nft={nfts[nfts.indexOf(listitem)]} />
          ))}
        </ul>
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
