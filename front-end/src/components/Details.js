import React, { useEffect, useState, useContext } from "react";
import * as RaribleApi from "../api/rarible-api";
import { UserContext } from "../util/UserContext";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import "../styles/detail.scss";
// 0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10
export default function DetailsView() {
  // const [id, setId] = useState("0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10");
  const user = useContext(UserContext);
  const [nfts, setNfts] = useState([]);
  const [nft, setNft] = useState({});
  const [nftMeta, setNftMeta] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchDataForNft();
    console.log(`Redirect Params : ${id}`);
  }, []);

  const fetchDataForNft = async () => {
    try {
      const nftsRes = await RaribleApi.getNfts(user.id);
      const nftRes = await RaribleApi.getNftById(id);
      const nftMetaRes = await RaribleApi.getNftMetaById(id);
      setNfts(nftsRes.items);
      setNft(nftRes);
      setNftMeta(nftMetaRes);
      setIsLoaded(true); //load it in ui
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (e) => {
    //file is picked
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", file);
    data.append("contract", nft.contract);
    data.append("token", nft.tokenId);
    data.append("wallet", user.id);

    try {
      NodeApi.postTransaction(data).then((data) => {
        //handle the response
        console.log(`Message : ${data.message}`);
      });
    } catch (err) {
      //catch some errors here
      console.log(e);
    }
  };

  return (
    <div>
      {isLoaded ? (
        // column 1
        <div className="detail-page-container">
          <div className="detail-preview-image ">
            <img
              className="nft-detail-preview"
              src={nftMeta.image.url.PREVIEW}
            />
          </div>
          <div className="detail-name-container">
            <h1 className="nft-detail-name">{nftMeta.name}</h1>
          </div>
          <div>
            <p className="nft-deatil-owner">
              Owned by <span className="owner-color">{user.name}</span>
            </p>
          </div>
          <div className="detail-container">
            {" "}
            <div>
              <h1 className="detail-about-nft">About the NFT</h1>
              <div className="about-the-nft">
                <div className="flex-grid-thirds">
                  <div className="col">
                    Creator <span className="about-span">{user.name}</span>
                  </div>
                  <div className="col">
                    Date Created{" "}
                    <span className="about-span date-created">{nft.date}</span>
                  </div>
                  <div className="col">
                    Edition <span className="about-span">{nft.edition}</span>
                  </div>
                </div>
                <div className="artist-statement">
                  Artist Statement
                  <p className="about-description">{user.description}</p>
                </div>
              </div>
              {/* <div>Username : {user.name}</div>
              <div>User Description : {user.description}</div>
              <div>User Image : {user.cover}</div>
              <div>Nfts Created : {nfts.length}</div>
              <div>First Nft Created : {nfts[nfts.length - 1].date}</div>
              <div>Contract Address : {nft.contract}</div>
              <div>Token Id : {nft.tokenId}</div>
              <div>BlockChain : Ethereum</div>
              <div>Created By : {user.name}</div>
              <div>Owned By : {user.name}</div>
              {/* <img src={nftMeta.image.url.PREVIEW} /> */}
              {/* <div>Date Created : {nft.date}</div>{" "} */}
              <div className="chain-info">
                <h1 className="detail-about-nft">Chain Info</h1>
                <div className="chain-content">
                  <div className="chain-flex">
                    <p>Contact Address</p>
                    <span className="chain-span contract-address">
                      {nft.contract}
                    </span>
                  </div>
                  <div className="chain-flex">
                    <p>Token Id</p>
                    <span className="chain-span">{nft.tokenId}</span>
                  </div>
                  <div className="chain-flex blockchain">
                    <p>BlockChain</p>
                    <span className="chain-span">Ethereum</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Column 2 */}
            <div className="create-darkblock">
              <form onSubmit={onSubmit}>
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
                    <div className="custom-file mb-4">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        {fileName}
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
                   <div>
                   </div>
                    <div className="custom-file mb-4">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        {fileName}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="about-darkblock">About the Darkblock</p>
                  <textarea
                    className="textarea"
                    placeholder="Add a description of the Darkblock or leave empty..."
                  ></textarea>
                </div>
                <div className="button-container">
                  <input
                    type="submit"
                    value="Create Darkblock"
                    className="create-darkblock-button"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
