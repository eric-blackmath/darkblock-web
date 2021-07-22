import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../util/UserContext";
import * as Formatter from "../util/formatter";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import "../styles/detail.scss";
import * as OpenseaApi from "../api/opensea-api";
import * as HashUtil from "../util/hash-util";
import * as MetamaskUtil from "../util/metamask-util";
import Darkblock from "./DarkblockStates";
import * as DetailsMeMapper from "../util/details-mapper";
import * as FileSupportHandler from "../util/file-support-handler";

import Footer from "../components/footer";

export default function DetailsView() {
  // const [id, setId] = useState("0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10");
  const address = useContext(UserContext);
  const [selectedLevel, setSelectedLevel] = useState("0"); //darkblock level
  const [nft, setNft] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUploadProgress, setFileUploadProgress] = useState("");
  const { contract, token } = useParams();
  const [darkblockDescription, setDarkblockDescription] = useState("");

  // const accountAddress = "0xc02bdb850930e943f6a6446f2cc9c4f2347c03e7";

  useEffect(() => {
    //!TODO Handle the id validation, then init requests

    const fetchDataForNft = async () => {
      try {
        const nft = await OpenseaApi.getSingleNft(contract, token).then(
          (res) => res.assets[0]
        );
        const mappedNft = await DetailsMeMapper.getMappedNft(nft);
        setNft(mappedNft);
        setIsLoaded(true); //load it in ui
      } catch (e) {
        console.log(e);
      }
    };

    try {
      fetchDataForNft();
    } catch (e) {
      console.log(e);
    }
  }, [contract, token]);

  const onCreateDarkblockClick = async (e) => {
    e.preventDefault();

    //check the owner of the nft
    if (nft.is_owned_by_user === true) {
      console.log(`Creating Darkblock`);
      initDarkblockCreation();
    } else {
      alert("Please select an nft that you own");
      console.log(`You are not the owner/creator of nft`);
    }
  };

  const initDarkblockCreation = async () => {
    setIsUploading(true);

    console.log(`Init Hashing the file`);
    const fileHash = await HashUtil.hashInChunks(file);
    console.log(`Hash of the file : ${fileHash}`);
    //now sign this hash with eth wallet and attach it to tags

    const signedHash = await MetamaskUtil.signTypedData(fileHash);

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", file);
    data.append("contract", nft.contract);
    data.append("token", nft.token);
    data.append("wallet", address); // replace with wallet
    data.append("level", selectedLevel);
    data.append("token_schema", nft.blockchain);
    data.append("darkblock_description", darkblockDescription);
    data.append("darkblock_hash", signedHash);

    try {
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          console.log(
            `Uploading File : ${Formatter.formatBytes(
              loaded
            )} of ${Formatter.formatBytes(total)} | ${percent}%`
          );

          if (percent < 100) {
            var progress = `${Formatter.formatBytes(
              loaded
            )} of ${Formatter.formatBytes(total)} | ${percent}%`;
            setFileUploadProgress(progress);
          }
        },
      };

      NodeApi.postTransaction(data, options).then((response) => {
        //handle the response
        //TODO handle the isCompleted with the status code

        if (response.status === 200) {
          setIsUploading(false);
          setIsUploadCompleted(true);
          console.log(`Message : ${data.message}`);
        } else {
          console.log(`Something went wrong with creating the darkblock`);
        }
      });
    } catch (err) {
      //catch some errors here
      console.log(err);
    }
  };

  const onDarkblockDescriptionChange = (e) => {
    //additional info is being added for darkblock creation
    setDarkblockDescription(e.target.value);
  };

  const levelOneFileSelectionHandler = async (e) => {
    //level one file is picked
    //TODO handle when user cancels the process

    const isFileSupported = FileSupportHandler.isFileFormatSupported(e);

    if (isFileSupported === true) {
      console.log(`Level One Selected`);
      setSelectedLevel("one");
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const levelTwoFileSelectionHandler = async (e) => {
    //level two file is picked
    //TODO handle when user cancels the process
    const isFileSupported = FileSupportHandler.isFileFormatSupported(e);

    if (isFileSupported === true) {
      console.log(`Level Two Selected`);
      setSelectedLevel("two");
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const redirectOwnerToOpensea = () => {
    window.open(`https://opensea.io/${nft.owner}`);
  };

  const redirectCreatorToOpensea = () => {
    window.open(`https://opensea.io/${nft.creator}`);
  };

  const redirectAddress = () => {
    window.open(`https://opensea.io/assets/${nft.contract}/${nft.token}`);
  };

  return (
    <div className="detail-background">
      {isLoaded ? (
        <div className="detail-page-container">
          <div className="detail-preview-image ">
            <img
              alt="nft-preview"
              className="nft-detail-preview"
              src={nft.image}
            />
          </div>
          <div className="detail-name-container">
            <h1 className="nft-detail-name">{nft.name}</h1>
          </div>
          <div>
            <p className="nft-deatil-owner">
              Owned by{" "}
              <a
                className="owner-link"
                onClick={redirectOwnerToOpensea}
                href="https://opensea.io/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="owner-color">{nft.owner}</span>
              </a>
            </p>
          </div>
          <div className="detail-container">
            {" "}
            <div>
              <h1 className="detail-about-nft">About the NFT</h1>
              <div className="about-the-nft">
                <div className="flex-grid-thirds">
                  <div className="col">
                    Creator{" "}
                    <a
                      onClick={redirectCreatorToOpensea}
                      target="_blank"
                      rel="noreferrer"
                      className="creator-link"
                    >
                      <span className="about-span ch-limit">{nft.creator}</span>
                    </a>
                  </div>
                  <div className="col">
                    Date Created{" "}
                    <span className="about-span date-created">
                      {nft.nft_date_created}
                    </span>
                  </div>
                  <div className="col">
                    Edition <span className="about-span">{nft.edition}</span>
                  </div>
                </div>
                <div className="artist-statement">
                  Artist Statement
                  <p className="about-description">{nft.nft_description}</p>
                </div>
              </div>
              <div className="chain-info">
                <h1 className="detail-about-nft">Chain Info</h1>
                <div className="chain-content">
                  <div className="chain-flex">
                    <p>Contract Address</p>
                    <a
                      className="owner-link contract-link"
                      onClick={redirectAddress}
                      href="https://opensea.io/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="chain-span contract-address">
                        {nft.contract}
                      </span>
                    </a>
                  </div>
                  <div className="chain-flex">
                    <p>Token Id</p>
                    <span className="chain-span">{nft.token}</span>
                  </div>
                  <div className="chain-flex blockchain">
                    <p>BlockChain</p>
                    <span className="chain-span">{nft.blockchain}</span>
                  </div>
                </div>
              </div>
            </div>
            <Darkblock
              levelOneFileSelectionHandler={levelOneFileSelectionHandler}
              levelTwoFileSelectionHandler={levelTwoFileSelectionHandler}
              nft={nft}
              createDarkblockHandle={onCreateDarkblockClick}
              isUploading={isUploading}
              isUploadCompleted={isUploadCompleted}
              fileName={fileName}
              selectedLevel={selectedLevel}
              darkblockDescription={darkblockDescription}
              onDarkblockDescriptionChange={onDarkblockDescriptionChange}
            />
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  );
}
