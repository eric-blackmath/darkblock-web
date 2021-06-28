import React, { useEffect, useState, useContext } from "react";
import * as RaribleApi from "../api/rarible-api";
import { UserContext } from "../util/UserContext";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";

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
        <div>
          {" "}
          <div>Username : {user.name}</div>
          <div>User Description : {user.description}</div>
          <div>User Image : {user.cover}</div>
          <div>Nfts Created : {nfts.length}</div>
          <div>First Nft Created : {nfts[nfts.length - 1].date}</div>
          <div>Contract Address : {nft.contract}</div>
          <div>Token Id : {nft.tokenId}</div>
          <div>BlockChain : Ethereum</div>
          <div>Created By : {user.name}</div>
          <div>Owned By : {user.name}</div>
          <div>Nft Image : {nftMeta.image.url.PREVIEW}</div>
          <div>Date Created : {nft.date}</div>{" "}
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
      ) : null}
    </div>
  );
}
