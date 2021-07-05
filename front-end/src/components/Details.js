import React, { useEffect, useState, useContext } from "react";
import * as RaribleApi from "../api/rarible-api";
import { UserContext } from "../util/UserContext";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import "../styles/detail.scss";
import * as OpenseaApi from "../api/opensea-api";

export default function DetailsView() {
  // const [id, setId] = useState("0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10");
  const user = useContext(UserContext);
  const [nfts, setNfts] = useState([]);
  const [isEncryptionOn, setIsEncryptionOn] = useState(false);
  const [nft, setNft] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const { id } = useParams();

  const dummy_account = "0x1fa2e96809465732c49f00661d94ad08d38e68df";

  useEffect(() => {
    //!TODO Handle the id validation, then init requests
    fetchDataForNft();
    console.log(`Redirect Params : ${id}`);
  }, []);

  const fetchDataForNft = async () => {
    try {
      const contractIdSplit = id.split("&");
      const contract = contractIdSplit[0];
      const tokenId = contractIdSplit[1];
      const nft = await OpenseaApi.getSingleNft(contract, tokenId).then(
        (res) => res.assets[0]
      );

      console.log(`Nft Details : ${JSON.stringify(nft.token_id)}`);

      setNft(nft);
      setIsLoaded(true); //load it in ui
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (e) => {
    //file is picked
    //TODO handle when user cancels the process
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleOnChangeEncryption = (e) => {
    //file is picked
    //TODO handle when user cancels the process
    setIsEncryptionOn(!isEncryptionOn);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", file);
    data.append("contract", nft.asset_contract.address);
    data.append("token", nft.token_id);
    data.append("wallet", dummy_account); // replace with wallet
    data.append("encryption", isEncryptionOn);

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

  const setName = () => {
    if (!nft.name) {
      return nft.collection.name;
    }
    return nft.name;
  };

  const setOwner = () => {
    if (nft.owner.user.username == "NullAddress") {
      return nft.creator.user.username;
    }
    return nft.owner.user.username;
  };

  const setCreator = () => {
    if (!nft.creator.user.username) {
      return nft.from_account.user.username;
    }
    return nft.creator.user.username;
  };

  const setEdition = () => {
    if (!nft.asset_contract.nft_version) {
      return "1/1";
    }
    return nft.asset_contract.nft_version;
  };

  return (
    <div>
      {isLoaded ? (
        // column 1
        <div className="detail-page-container">
          <div className="detail-preview-image ">
            <img className="nft-detail-preview" src={nft.image_url} />
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
                    <div></div>
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
                    type="checkbox"
                    id="encryption-on"
                    name="is-encryption-on"
                    value="Encryption On"
                    checked={isEncryptionOn}
                    onChange={handleOnChangeEncryption}
                  />
                  Encryption On
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
