import React from "react";
import "../styles/preview.scss";
import "../styles/detail.scss";
import * as DateUtil from "../util/date";
import FileChooserSilver from "./FileChooserSilver";
import FileChooserGold from "./FileChooserGold";
import goldblock from "../images/goldblock.png";
import silverblock from "../images/silverblock.png";
import loading from "../images/loading.mp4";
import $ from "jquery";

export default function DarkblockStates({
  levelOneFileSelectionHandler,
  levelTwoFileSelectionHandler,
  nft,
  createDarkblockHandle,
  isUploading,
  isUploadCompleted,
  fileName,
  selectedLevel,
  darkblockDescription,
  onDarkblockDescriptionChange,
}) {
  var levelOneFileSelectionHandlerMiddle = levelOneFileSelectionHandler;
  var levelTwoFileSelectionHandlerMiddle = levelTwoFileSelectionHandler;

  var createDarkblockClickHandle = createDarkblockHandle;

  // const address = useContext(UserContext);

  // ui states for the block
  // darkblocked true - already darkblocked (state 0)
  // darkblocked false, own false - ask the owner      (state 1)
  // darkblocked false, own true - create darkblock    (state 2)

  // no file selected
  $(document).ready(function () {
    $("input:file").change(function () {
      if ($(this).val()) {
        $("input:submit").attr("disabled", false);
      }
    });
  });

  return (
    <div>
      {/* state 0 */}
      {/* there is a darkblock */}
      {nft.is_darkblocked === true ? (
        <div>
          {nft.encryptionLevel === "one" ? (
            <div>
              <div className="create-darkblock darkblock-found">
                <div className="dbfound-level">
                  <label className="dbfound-label">Level 1</label>
                </div>

                <h1 className="dbfound-title">Protected by Darkblock</h1>
                <div className="dbfound">
                  <div className="dbfound-content">
                    <img
                      className="gold-block"
                      src={silverblock}
                      alt="gold block"
                    />
                  </div>
                  <div className="dbfound-content">
                    <h5 className="dbfound-subtitle">Description</h5>
                    <p className="dbfound-text">{nft.darkblock_description}</p>

                    <h5 className="dbfound-subtitle">Date Created</h5>
                    <p className="dbfound-text">
                      {DateUtil.getFormattedDateFromMillis(
                        nft.darkblock_date_created
                      )}
                    </p>
                    <p className="dbfound-text">
                      {" "}
                      To view this Darkblock you need the Darkblock Android TV
                      app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="create-darkblock darkblock-found">
                <div className="dbfound-level">
                  <label className="dbfound-label">Level 2</label>
                </div>

                <h1 className="dbfound-title">Protected by Darkblock</h1>
                <div className="dbfound">
                  <div className="dbfound-content">
                    <img
                      className="gold-block"
                      src={goldblock}
                      alt="gold block"
                    />
                  </div>
                  <div className="dbfound-content">
                    <h5 className="dbfound-subtitle">Description</h5>
                    <p className="dbfound-text">{nft.darkblock_description}</p>

                    <h5 className="dbfound-subtitle">Date Created</h5>
                    <p className="dbfound-text">
                      {DateUtil.getFormattedDateFromMillis(
                        nft.darkblock_date_created
                      )}
                    </p>
                    <p className="dbfound-text">
                      {" "}
                      To view this Darkblock you need the Darkblock Android TV
                      app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {/* state 1 */}
      {/* no darkblock found */}
      {nft.is_darkblocked === false && nft.is_owned_by_user === false ? (
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
      {/* put exclamation back on one above */}
      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === true &&
      isUploadCompleted === false ? (
        <div>
          <div>
            <div className="create-darkblock">
              <div className="loading-container">
                <div className="loading-animation">
                  <video autoPlay playsInline loop>
                    <source src={loading} type="video/mp4" />
                  </video>
                </div>
                <div className="loading-content">
                  <h1 className="loading-title">
                    Your Darkblock is <br></br> being created...
                  </h1>
                  <p className="loading-text">
                    Please DO NOT close this page until this process is
                    finished. <br></br> — <br></br> Depending on the file size
                    and your internet connection the upload time may take up to
                    a few minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === false &&
      isUploadCompleted === true ? (
        <div>
          {selectedLevel === "one" ? (
            <div>
              <div>
                <div className="create-darkblock">
                  <div className="upload-success">
                    <img
                      className="success-image"
                      src={silverblock}
                      alt="block"
                    />
                    <div className="loading-content">
                      <h1>
                        Your{" "}
                        <span className="success-yellow">Supercharged</span>{" "}
                        Darkblock has been created
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <div className="create-darkblock">
                  <div className="upload-success">
                    <img
                      className="success-image"
                      src={goldblock}
                      alt="block"
                    />
                    <div className="loading-content">
                      <h1>
                        Your <span className="success-yellow">Protected</span>{" "}
                        Darkblock has been created
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === false &&
      isUploadCompleted === false ? (
        <div>
          <div className="create-darkblock">
            <form onSubmit={createDarkblockClickHandle}>
              <div>
                <div className="create-darkblock-container">
                  <h1 className="create-title">Create Darkblock</h1>
                  <p className="create-subtitle">
                    Upload your file (max 350MB) and select your Darkblock level.{" "}
                  </p>
                  <p className="create-subtitle subtitle-space">
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
                    <span className="upgrade-type">Supercharged</span>
                    <ul className="upgrade-detail-list">
                      <li>Large filesize support (350MB)</li>
                      <li>Stored forever on Arweave</li>
                    </ul>
                  </div>

                  <FileChooserSilver
                    fileSelectionHandlerLevelOne={
                      levelOneFileSelectionHandlerMiddle
                    }
                  />

                  {/* <div className="custom-file mb-4">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="levelOneFile"
                      onChange={levelTwoFileSelectionHandler}
                    />
                    <label className="custom-file-label" htmlFor="levelOneFile">
                      {selectedLevel === "one" ? fileName : null}
                    </label>
                  </div> */}
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

                  <FileChooserGold
                    fileSelectionHandlerLevelTwo={
                      levelTwoFileSelectionHandlerMiddle
                    }
                  />
                </div>
              </div>

              <div>
                <p className="about-darkblock">About the Darkblock</p>
                <textarea
                  className="textarea"
                  placeholder="Add a description of the Darkblock (optional)"
                  value={darkblockDescription}
                  onChange={onDarkblockDescriptionChange}
                ></textarea>
              </div>
              <div className="button-container">
                {isUploading ? null : (
                  <input
                    type="submit"
                    value="Create Darkblock"
                    className="create-darkblock-button"
                    id="darkblock-submit"
                    disabled
                  />
                )}

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
