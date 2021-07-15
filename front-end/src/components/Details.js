import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../util/UserContext";
import * as Formatter from "../util/formatter";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import "../styles/detail.scss";
import * as OpenseaApi from "../api/opensea-api";
import * as HashUtil from "../util/hash-util";
import * as parser from "../util/parser";
import * as MetamaskUtil from "../util/metamask-util";
import Darkblock from "./DarkblockStates";
import * as DetailsMeMapper from "../util/details-mapper";

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

  const accountAddress = "0xc02bdb850930e943f6a6446f2cc9c4f2347c03e7";

  useEffect(() => {
    //!TODO Handle the id validation, then init requests

    const fetchDataForNft = async () => {
      try {
        const nft = await OpenseaApi.getSingleNft(contract, token).then(
          (res) => res.assets[0]
        );
        const mappedNft = await DetailsMeMapper.getMappedNft(nft);
        console.log(mappedNft.is_owned_by_user);
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

    console.log(`Logged In User : ${address}`);
  }, []);

  const onCreateDarkblockClick = async (e) => {
    e.preventDefault();

    //check the owner of the nft
    console.log(nft.is_owned_by_user);
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
            `${Formatter.formatBytes(loaded)} of ${Formatter.formatBytes(
              total
            )} | ${percent}%`
          );

          if (percent < 100) {
            var progress = `${Formatter.formatBytes(
              loaded
            )} of ${Formatter.formatBytes(total)} | ${percent}%`;
            setFileUploadProgress(progress);
          }
        },
      };

      NodeApi.postTransaction(data, options).then((data) => {
        //handle the response
        //TODO handle the isCompleted with the status code

        setIsUploading(false);
        setIsUploadCompleted(true);
        console.log(`Message : ${data.message}`);
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

  const levelOneFileSelectionHandler = async (files) => {
    //level one file is picked
    //TODO handle when user cancels the process
    console.log(`Level One Selected`);
    setSelectedLevel("one");
    setFile(files[0]);
    setFileName(files[0].name);
  };

  const levelTwoFileSelectionHandler = async (files) => {
    //level two file is picked
    //TODO handle when user cancels the process
    console.log(`Level Two Selected`);
    setSelectedLevel("two");
    setFile(files[0]);
    setFileName(files[0].name);
  };

  return (
    <div>
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
              Owned by <span className="owner-color">{nft.owner}</span>
            </p>
          </div>
          <div className="detail-container">
            {" "}
            <div>
              <h1 className="detail-about-nft">About the NFT</h1>
              <div className="about-the-nft">
                <div className="flex-grid-thirds">
                  <div className="col">
                    Creator <span className="about-span">{nft.creator}</span>
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
                    <span className="chain-span contract-address">
                      {nft.contract}
                    </span>
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
            {/* <div className="create-darkblock">
              <form onSubmit={onCreateDarkblockClick}>
                <div>
                  <div className="create-darkblock-container">
                    <h1 className="create-title">Create Darkblock</h1>
                    <p className="create-subtitle">
                      Upload your file and select your Darkblock level.{" "}
                    </p>
                    <p className="create-subtitle">
                      Note: You need the Darkblock Android TV app to view a
                      Darkblock upgrade.
                    </p>
                  </div>
                </div>
                <div className="upgrade-grid">
                  <div>
                    <div className="upgrade-level">
                      <p className="upgrade-number">LEVEL 1</p>
                    </div>
                    <div className="upgrade-title">
                      <span className="upgrade-type">SUPERCHARGED</span>
                      <ul className="upgrade-detail-list">
                        <li>Massive filesize support</li>
                        <li>Stored forever on Arweave</li>
                      </ul>
                    </div>

                    <Preview
                      levelOneFileSelectionHandler={
                        levelOneFileSelectionHandler
                      }
                      isDarkblocked={isDarkblocked}
                      isOwnedByUser={isOwnedByUser}
                    />
                    <div className="custom-file mb-4">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="levelOneFile"
                        onChange={onLevelOneFileChange}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="levelOneFile"
                      >
                        {level === "one" ? fileName : null}
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="upgrade-level">
                      <p className="upgrade-number">LEVEL 2</p>
                    </div>
                    <div className="upgrade-title">
                      <span className="upgrade-type">
                        Protected by Darkblock
                      </span>
                      <ul className="upgrade-detail-list">
                        <li>Software encryption</li>
                        <li>All features of level 1</li>
                      </ul>
                    </div>
                    <PreviewTwo
                      levelTwoFileSelectionHandler={
                        levelTwoFileSelectionHandler
                      }
                    />
                    <div className="custom-file mb-4">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="levelTwoFile"
                        onChange={onLevelTwoFileChange}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="levelTwoFile"
                      >
                        {level === "two" ? fileName : null}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="about-darkblock">About the Darkblock</p>
                  <textarea
                    className="textarea"
                    placeholder="Add a description of the Darkblock or leave empty..."
                    value={darkblockDescription}
                    onChange={onDarkblockDescriptionChange}
                  ></textarea>
                </div>
                <div className="button-container">
                  {isDarkblocked || isUploading ? null : ( 
                    <input
                      type="submit"
                      value="Create Darkblock"
                      className="create-darkblock-button"
                    />
                  )}

                  {fileUploadProgress > 0 ? (
                    <label>{fileUploadProgress}</label>
                  ) : null}
                </div>
              </form>
            </div> */}
          </div>
        </div>
      ) : null}
    </div>
  );
}
