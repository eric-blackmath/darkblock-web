import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import NFTItem from "./NftItem";
import { UserContext } from "../util/UserContext";
import * as MyNftsMapper from "../util/my-nfts-mapper";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import loadingblock from "../images/loadingblock.svg";
import Footer from "../components/footer";
import $ from "jquery";
import toparrow from "../images/toparrow.svg";
import Card from "react-bootstrap/Card";
import grey from "../images/grey.svg";


export default function MyNfts() {
  const [nfts, setNfts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
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
    $("a[href='#top']").click(function() {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });
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
      const withoutBlanks = removeBlanks(updatedNfts);

      setNfts(withoutBlanks);
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

  return (
    <React.Fragment>
      {/* <button>Go to detailsView</button> */}
      <div>
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
                    <Card.Text className="meta-data card-limit"></Card.Text>
                    <Card.Text className="meta-data card-limit"></Card.Text>
                  </Card.Body>
                </Card>
                </div>
              );
            }
          })}
        </ul>
        <a id="scroll" className="to-top" href="#top">
          <img src={toparrow} alt="to top" />
        </a>
      </div>

      {isLoaded === false && currentPage === 1 ? (
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
      ) : null}

      {isLoaded === true && noNftsFound === true ? (
        <div className="none-found">
          <h1>We couldn't find any NFTs in your wallet!</h1>
          <p className="none-found-p">
          Start by creating an NFT on any Ethereum based NFT minting site and then come back here to create a Darkblock for that NFT. The NFT must be minted on-chain, if it is done gasless/lazy (on any other site but Opensea) then it may not appear.
          </p>
          <p className="none-found-p">
          Questions or problems? Please come chat with us on our <a href="https://chat.darkblock.io" target="_blank">Discord</a>!
          </p>
          
        </div>
      ) : null}

      <Footer />
    </React.Fragment>
  );
}
