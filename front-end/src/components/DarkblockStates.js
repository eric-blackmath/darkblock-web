import React from "react";
import "../styles/preview.scss";
import "../styles/detail.scss";
import { UserContext } from "../util/UserContext";
import { useEffect, useState, useContext } from "react";
import FileChooserOne from "./FileChooser";
import goldblock from "../images/goldblock.png";

export default function DarkblockStates({
  levelOneFileSelectionHandler,
  levelTwoFileSelectionHandler,
  isDarkblocked,
  isOwnedByUser,
  createDarkblockHandle,
}) {
  var levelFileSelectionHandler = levelOneFileSelectionHandler;
  var levelTwoFileSelectionHandler = levelTwoFileSelectionHandler;

  var createDarkblockClickHandle = createDarkblockHandle;

  const address = useContext(UserContext);

  useEffect(() => {
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
        levelFileSelectionHandler(files);

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
  }, []);

  // ui states for the block
  // darkblocked true - already darkblocked (state 0)
  // darkblocked false, own false - ask the owner      (state 1)
  // darkblocked false, own true - create darkblock    (state 2)
  return (
    <div>
      {/* state 0 */}
      {/* there is a darkblock */}
      {isDarkblocked ? (
        <div>
          <div className="create-darkblock darkblock-found">
            <h1 className="dbfound-title">Protected by Darkblock</h1>
            <div className="dbfound">
              <div className="dbfound-content">
                <img className="gold-block" src={goldblock} alt="gold block" />
              </div>
              <div className="dbfound-content">
                <h5 className="dbfound-subtitle">Description</h5>
                <p className="dbfound-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Semper feugiat nibh sed pulvinar proin gravida hendrerit
                  lectus. Nulla facilisi etiam dignissim diam quis enim lobortis
                  scelerisque fermentum.
                </p>
              
                <h5 className="dbfound-subtitle">Date Created</h5>
                <p className="dbfound-text">date created here</p>
                <p className="dbfound-text">
                  {" "}
                  To view this Darkblock you need the Darkblock Android TV app.
                </p>
                </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* state 1 */}
      {/* no darkblock found */}
      {!isDarkblocked && !isOwnedByUser ? (
        <div>
          <div className="create-darkblock no-darkblock">
            <h1>No Darkblock Found</h1>
            <p>
              No Darkblock has been detected for this NFT. Only the creator of
              the NFT can create Darkblocks. Please contact the creator of the
              NFT to request a Darkblock for this NFT.
            </p>
          </div>
        </div>
      ) : null}
      {/* state 2 */}
      {/* create darkblock */}
      {!isDarkblocked && isOwnedByUser ? (
        <div>
          <div className="create-darkblock">
            <form onSubmit={createDarkblockClickHandle}>
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

                  <FileChooserOne
                    fileSelectionHandler={levelOneFileSelectionHandler}
                  />

                  <div className="custom-file mb-4">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="levelOneFile"
                      onChange={levelFileSelectionHandler}
                    />
                    {/* <label className="custom-file-label" htmlFor="levelOneFile">
                      {level === "one" ? fileName : null}
                    </label> */}
                  </div>
                </div>
                <div>
                  <div className="upgrade-level">
                    <p className="upgrade-number">LEVEL 2</p>
                  </div>
                  <div className="upgrade-title">
                    <span className="upgrade-type">Protected by Darkblock</span>
                    <ul className="upgrade-detail-list">
                      <li>Software encryption</li>
                      <li>All features of level 1</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <p className="about-darkblock">About the Darkblock</p>
                <textarea
                  className="textarea"
                  placeholder="Add a description of the Darkblock or leave empty..."
                  // value={darkblockDescription}
                  // onChange={onDarkblockDescriptionChange}
                ></textarea>
              </div>
              <div className="button-container">
                {/* {isDarkblocked || isUploading ? null : (
                  <input
                    type="submit"
                    value="Create Darkblock"
                    className="create-darkblock-button"
                  />
                )} */}

                {/* {fileUploadProgress > 0 ? (
                  <label>{fileUploadProgress}</label>
                ) : null} */}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}