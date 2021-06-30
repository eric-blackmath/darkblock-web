import React, { useEffect, useState, useContext } from "react";
import * as RaribleApi from "../api/rarible-api";
import { UserContext } from "../util/UserContext";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
<<<<<<< HEAD

=======
import "../styles/detail.scss";
// 0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10
>>>>>>> 63655011df0cc315cd33f3a061831689f6e2dce1
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
    //TODO handle when user cancels the process
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
        <div>
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
            <div >
              <h1 className="detail-about-nft">About the NFT</h1>
              <div className="about-the-nft">
                <div className="flex-grid-thirds">
                  <div className="col">
                    Creator <span className="about-span">{user.name}</span>
                  </div>
                  <div className="col">
                    Date Created <span className="about-span">{nft.date}</span>
                  </div>
                  <div className="col">
                    Edition <span className="about-span">{nft.edition}</span>
                  </div>
                </div>
                <div className="artist-statement">
                  Artist Statement
                  <p className="about-description">
                    {user.description}
                  </p>
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
              <form onSubmit={onSubmit}>
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

                <input
                  type="submit"
                  value="Create Darkblock"
                  className="btn btn-primary btn-block mt-4"
                />
              </form>
            </div>
            <div className="create-darkblock">
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
                  <p>Level 1</p>
                </div>
                <div>
                  <p>level 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
