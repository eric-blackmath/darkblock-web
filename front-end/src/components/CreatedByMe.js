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
import toparrow from "../images/toparrow.svg";
import $ from "jquery";
import Card from "react-bootstrap/Card";
import grey from "../images/grey.svg";

var tempNfts = [];

export default function CreatedByMe() {
  const [nfts, setNfts] = useState([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [hasMore, setHasMore] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const address = useContext(UserContext);
  const { account } = useParams();

  const timeOut = async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Completed in ${t}`);
      }, t);
    });
  };

  useEffect(() => {

  //   $(document).ready(function(){
  //     $("#scroll").click(function() {
  //         $("html, body").animate({ 
  //             scrollTop: 0 
  //         }, "slow");
  //         return false;
  //     });
  // });
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
    if (currentPage !== 1) {
      //add blanks only on later pages, isLoaded is used for first load
      addBlanks(nfts);
    }
    setIsLoaded(false);

    var accountAddress = address;
    if (account) {
      accountAddress = account;
    }

    await timeOut(0);
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
        const withoutBlanks = removeBlanks(filteredFullList);
        console.log(`without Blanks : ${withoutBlanks.length}`);
        setNfts(withoutBlanks);
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
  };

  const addBlanks = (nfts) => {
    for (let i = 0; i < (nfts.length % 4) + 8; i++) {
      nfts.push(undefined);
    }
    setNfts(nfts);
  };

  const removeBlanks = (nfts) => {
    var noBlanks = nfts.filter(function (el) {
      return el != null;
    });
    return noBlanks;
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
  function scrollTop() {
    window.scrollTo(0, 0);
  }
  return (
    <React.Fragment>
      {/* <button>Go to detailsView</button> */}
      <ul className="list-group">
        {nfts.map((nft, index) => {
          if (nft != null) {
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
          } else {
            return (
              <div key={index}>
                <Card>
                  <div className="image-container">
                    <Card.Img
                      className="preview-image"
                      alt="darkblock image"
                      variant="top"
                      src={grey}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title
                      data-testid="nft-title"
                      style={{ width: "100%", backgroundColor: "pink" }}
                      className="nft-title"
                    ></Card.Title>
                    <Card.Text
                      style={{ width: "100%", backgroundColor: "grey" }}
                      className="meta-data card-limit"
                    ></Card.Text>
                    <Card.Text
                      style={{ width: "100%", backgroundColor: "grey" }}
                      className="meta-data card-limit"
                    ></Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          }
        })}
        <a onClick={scrollTop()} id="scroll" className="to-top" href="#">
          <img src={toparrow} alt="to top" />
        </a>
      </ul>

      {/* {isLoaded === false && currentPage === 1 ? (
        <div className="list-group">
          <Card>
            <div className="image-container">
              <Card.Img
                className="preview-image"
                alt="darkblock image"
                variant="top"
                src={grey}
              />
            </div>
            <Card.Body>
              <Card.Title
                data-testid="nft-title"
                style={{ width: "100%", backgroundColor: "pink" }}
                className="nft-title"
              ></Card.Title>
              <Card.Text className="meta-data card-limit"></Card.Text>
              <Card.Text className="meta-data card-limit"></Card.Text>
            </Card.Body>
          </Card>
        </div>
      ) : null} */}

      {isLoaded === true && noNftsFound === true ? (
        <div className="none-found">
          <h1>We couldn't find any NFTs in your wallet!</h1>
          <p className="none-found-p">
            Start by creating an NFT on any Ethereum based NFT minting site and
            then come back here to create a Darkblock for that NFT. The NFT must
            be minted on-chain, if it is done gasless/lazy (on any other site
            but Opensea) then it may not appear.
          </p>
          <p className="none-found-p">
            Questions or problems? Please come chat with us on our{" "}
            <a href="https://chat.darkblock.io" target="_blank">
              Discord
            </a>
            !
          </p>
        </div>
      ) : null}

      <Footer />
    </React.Fragment>
  );
}
