import React from "react";
import { Link } from "react-router-dom";

import "../App.scss";
import Card from "react-bootstrap/Card";

const NFTITem = ({ nft, selectionHandler, darkblocked }) => {
  var handleToUpdate = selectionHandler;

  const setName = () => {
    if (!nft.name) {
      return nft.asset.collection.name;
    }
    return nft.asset.name;
  };

  const setOwner = () => {
    if (nft.asset.owner.user.username == "NullAddress") {
      return nft.from_account.user.username;
    }
    return nft.asset.owner.user.username;
  };

  return (
    <div className="nft-item">
      <Link
        to={
          "/details/" +
          nft.asset.asset_contract.address +
          "/" +
          nft.asset.token_id
        }
      >
        <Card>
          <div className="image-container">
            <Card.Img
              className="preview-image"
              variant="top"
              src={nft.asset.image_preview_url}
            />
          </div>
          <Card.Body>
            <Card.Title className="nft-title">{setName()}</Card.Title>
            <Card.Text className="meta-data">
              Created By:{" "}
              <span className="meta-bold">
                {nft.from_account.user.username}
              </span>
            </Card.Text>
            <Card.Text className="meta-data">
              Owned By: <span className="meta-bold">{setOwner()}</span>
            </Card.Text>
            <Card.Text className="meta-data">
              <span className="meta-bold">
                {darkblocked ? "Protected by Darkblock" : "No Darkblock found"}
              </span>
            </Card.Text>
          </Card.Body>
        </Card>
        {/* <button onClick={() => handleToUpdate(nftIndex)}>Select</button> */}
      </Link>
      <br></br>
    </div>
  );
};

export default NFTITem;
