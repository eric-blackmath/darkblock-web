import React from "react";
import "../styles/preview.scss";
import "../styles/detail.scss";
import { UserContext } from "../util/UserContext";
import * as Formatter from "../util/formatter";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import * as OpenseaApi from "../api/opensea-api";
import one from "../images/levelone.png";
import { useEffect, useState, useContext } from "react";
import Preview from "./Darkblock";
import PreviewTwo from "./LevelTwoFileChooser";
import * as HashUtil from "../util/hash-util";
import * as parser from "../util/parser";

export default function LevelOneFileChooser({
  levelOneFileSelectionHandler,
  isDarkblocked,
  isOwnedByUser,
}) {
  var fileSelectionHandler = levelOneFileSelectionHandler;
  const address = useContext(UserContext);
  const [level, setLevel] = useState("0"); //darkblock level
  const [nft, setNft] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [ setIsDarkblocked] = useState(false);
  const [ setIsOwnedByUser] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUploadProgress, setFileUploadProgress] = useState("");
  const { contract, token } = useParams();
  const [darkblockDescription, setDarkblockDescription] = useState("");
  const accountAddress = "0x54196238400305778bff5fa200ee1896f6a9d5c2";

  useEffect(() => {
    const fetchDataForNft = async () => {
      try {
        const nft = await OpenseaApi.getSingleNft(contract, token).then(
          (res) => res.assets[0]
        );
        var id = parser.getContractAndTokensDetails(nft);
        await checkIfAlreadyDarkblocked(id);
        checkIfNftOwnedByUser(nft);
        setNft(nft);
        setIsLoaded(true); //load it in ui
      } catch (e) {
        console.log(e);
      }
    };
    fetchDataForNft();


    console.log(`Address : ${address}`);
    console.log(`Redirect Params : ${contract} : ${token}`);
    // File Upload
    //
    function ekUpload() {
      console.log(`IsOwnedByUser : ${isOwnedByUser}`);
      function Init() {
        console.log("Upload Initialised");

        var fileSelect = document.getElementById("file-upload"),
          fileDrag = document.getElementById("file-drag"),
          submitButton = document.getElementById("submit-button");

        fileSelect.addEventListener("change", fileSelectHandler, false);

        // Is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
          // File Drop
          fileDrag.addEventListener("dragover", fileDragHover, false);
          fileDrag.addEventListener("dragleave", fileDragHover, false);
          fileDrag.addEventListener("drop", fileSelectHandler, false);
        }
      }

      function fileDragHover(e) {
        var fileDrag = document.getElementById("file-drag");

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className =
          e.type === "dragover" ? "hover" : "modal-body file-upload";
      }

      function fileSelectHandler(e) {
        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);
        fileSelectionHandler(files);

        // Process all File objects
        for (var i = 0, f; (f = files[i]); i++) {
          parseFile(f);
          uploadFile(f);
        }
      }

      // Output
      function output(msg) {
        // Response
        var m = document.getElementById("messages");
        m.innerHTML = msg;
      }

      function parseFile(file) {
        console.log(file.name);
        output("<strong>" + encodeURI(file.name) + "</strong>");

        // var fileType = file.type;
        // console.log(fileType);
        var imageName = file.name;

        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
          document.getElementById("start").classList.add("hidden");
          document.getElementById("response").classList.remove("hidden");
          document.getElementById("notimage").classList.add("hidden");
          // Thumbnail Preview
          document.getElementById("file-image").classList.remove("hidden");
          document.getElementById("file-image").src = URL.createObjectURL(file);
        } else {
          document.getElementById("file-image").classList.add("hidden");
          document.getElementById("notimage").classList.remove("hidden");
          document.getElementById("start").classList.remove("hidden");
          document.getElementById("response").classList.add("hidden");
          document.getElementById("file-upload-form").reset();
        }
      }

      function setProgressMaxValue(e) {
        var pBar = document.getElementById("file-progress");

        if (e.lengthComputable) {
          pBar.max = e.total;
        }
      }

      function updateFileProgress(e) {
        var pBar = document.getElementById("file-progress");

        if (e.lengthComputable) {
          pBar.value = e.loaded;
        }
      }

      function uploadFile(file) {
        var xhr = new XMLHttpRequest(),
          fileInput = document.getElementById("class-roster-file"),
          pBar = document.getElementById("file-progress"),
          fileSizeLimit = 1024; // In MB
        if (xhr.upload) {
          // Check if file is less than x MB
          if (file.size <= fileSizeLimit * 1024 * 1024) {
            // Progress bar
            pBar.style.display = "none";
            xhr.upload.addEventListener(
              "loadstart",
              setProgressMaxValue,
              false
            );
            xhr.upload.addEventListener("progress", updateFileProgress, false);

            // File received / failed
            xhr.onreadystatechange = function (e) {
              if (xhr.readyState == 4) {
                // Everything is good!
                // progress.className = (xhr.status == 200 ? "success" : "failure");
                // document.location.reload(true);
              }
            };

            // Start upload
            xhr.open(
              "POST",
              document.getElementById("file-upload-form").action,
              true
            );
            xhr.setRequestHeader("X-File-Name", file.name);
            xhr.setRequestHeader("X-File-Size", file.size);
            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.send(file);
          } else {
            output(
              "Please upload a smaller file (< " + fileSizeLimit + " MB)."
            );
          }
        }
      }

      // Check for the various File API support.
      // if (window.File && window.FileList && window.FileReader) {
      //   Init();
      // } else {
      //   document.getElementById("file-drag").style.display = "none";
      // }
    }
    ekUpload();
  }, []);

  const checkIfAlreadyDarkblocked = async (ids) => {
    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("ids", ids);

    try {
      const verifyRes = await NodeApi.verifyNFTs(data);
      //handle the response
      var matches = verifyRes.data;
      if (matches) {
        //nft already darkblocked
        setIsDarkblocked(true);
        console.log(`Verify Response : ${JSON.stringify(matches)}`);
      }
    } catch (err) {
      //catch some errors here
      console.log(err);
    }
  };

  const checkIfNftOwnedByUser = (nft) => {
    console.log(`Account Address : ${accountAddress}`);
    console.log(`Owner Address : ${nft.owner.address}`);
    console.log(`Creator Address : ${nft.creator.address}`);

    if (nft.owner.address === address) {
      setIsOwnedByUser(true);
    } else {
      setIsOwnedByUser(false);
    }
  };

  
  const onCreateDarkblockClick = async (e) => {
    e.preventDefault();

    //check the owner of the nft
    if (checkIfNftOwnedByUser()) {
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

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", file);
    data.append("contract", nft.asset_contract.address);
    data.append("token", nft.token_id);
    data.append("wallet", address); // replace with wallet
    data.append("level", level);
    data.append("token_schema", nft.asset_contract.schema_name);
    data.append("darkblock_description", darkblockDescription);
    data.append("darkblock_hash", fileHash);

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
        console.log(`Message : ${data.message}`);
      });
    } catch (err) {
      //catch some errors here
      console.log(err);
    }
  };

  const setName = () => {
    if (!nft.name) {
      return nft.collection.name;
    }
    return nft.name;
  };

  const setOwner = () => {
    if (nft.owner.user) {
      //got owner
      if (
        !nft.owner.user.username ||
        nft.owner.user.username === "NullAddress"
      ) {
        //the username of owner is not set
        return "No Username";
      }
      return nft.owner.user.username;
    } else if (nft.creator.user) {
      //got creator
      if (
        !nft.creator.user.username ||
        nft.creator.user.username === "NullAddress"
      ) {
        //creator username not set
        return "No Username";
      }
      return nft.creator.user.username;
    } else {
      //no owner, no creator
      return "No Username";
    }
  };

  const setCreator = () => {
    if (nft.creator.user) {
      //got creator
      if (
        !nft.creator.user.username ||
        nft.creator.user.username === "NullAddress"
      ) {
        //the username of owner is not set
        return "No Username";
      }
      return nft.creator.user.username;
    } else if (nft.owner.user) {
      //got owner
      if (
        !nft.owner.user.username ||
        nft.owner.user.username === "NullAddress"
      ) {
        //owner username not set
        return "No Username";
      }
      return nft.owner.user.username;
    } else {
      //no owner, no creator
      return "No Username";
    }
  };

  const setEdition = () => {
    if (!nft.asset_contract.nft_version) {
      return "1/1";
    }
    return nft.asset_contract.nft_version;
  };

  // ui states for the block
  // darkblocked true - already darkblocked (state 0)
  // darkblocked false, own false - ask the owner      (state 1)
  // darkblocked false, own true - create darkblock    (state 2)
  return (
    <div>
      {/* state 0 */}
      {isDarkblocked ? <div>Show Already Darkblocked UI</div> : null}
      {/* state 1 */}
      {!isDarkblocked && !isOwnedByUser ? (
        <div>
          hello
          
        <div className="detail-page-container">
          <div className="detail-preview-image ">
            <img
              alt="nft-preview"
              className="nft-detail-preview"
              src={nft.image_url}
            />
          </div>
          <div className="detail-name-container">
            <h1 className="nft-detail-name">{setName()}</h1>
          </div>
          <div>
            <p className="nft-deatil-owner">
              Owned by <span className="owner-color">{setOwner()}</span>
            </p>
          </div>
          <div className="detail-container">
            {" "}
            <div>
              <h1 className="detail-about-nft">About the NFT</h1>
              <div className="about-the-nft">
                <div className="flex-grid-thirds">
                  <div className="col">
                    Creator <span className="about-span">{setCreator()}</span>
                  </div>
                  <div className="col">
                    Date Created{" "}
                    <span className="about-span date-created">
                      {nft.asset_contract.created_date}
                    </span>
                  </div>
                  <div className="col">
                    Edition <span className="about-span">{setEdition()}</span>
                  </div>
                </div>
                <div className="artist-statement">
                  Artist Statement
                  <p className="about-description">{"TBD"}</p>
                </div>
              </div>
              <div className="chain-info">
                <h1 className="detail-about-nft">Chain Info</h1>
                <div className="chain-content">
                  <div className="chain-flex">
                    <p>Contact Address</p>
                    <span className="chain-span contract-address">
                      {nft.asset_contract.address}
                    </span>
                  </div>
                  <div className="chain-flex">
                    <p>Token Id</p>
                    <span className="chain-span">{nft.token_id}</span>
                  </div>
                  <div className="chain-flex blockchain">
                    <p>BlockChain</p>
                    <span className="chain-span">
                      {nft.asset_contract.schema_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Column 2 */}
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
          Show Ask the owner UI
        </div>
      ) : null}
      {/* state 2 */}
      {!isDarkblocked && isOwnedByUser ? (
        <div className="create-darkblock">
            <h1>hello</h1>
           {/* <form onSubmit={onCreateDarkblockClick}>
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
              </form> */}
      </div>
      ) : null}
      
    </div>
  );
}
