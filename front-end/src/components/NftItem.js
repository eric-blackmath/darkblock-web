import React from "react";
import { Link } from "react-router-dom";
import "../App.scss";
import Card from "react-bootstrap/Card";

const NFTITem = ({ nft, selectionHandler, darkblocked }) => {
  var handleToUpdate = selectionHandler;

  const setName = () => {
    if (!nft.asset.name) {
      return nft.asset.collection.name;
    }
    return `${nft.asset.name}`;
  };

  const setOwner = () => {
    var owner = "";
    if (nft.asset.owner.user.username === "NullAddress") {
      return nft.from_account.user.username;
    }
    return nft.asset.owner.user.username;
  };

  const setCreator = () => {
    var creator = "";
    if (!nft.from_account) {
      //creator is missing in all of em, (without event_type)
      if (nft.event_type === "transfer") {
        creator = nft.to_account.user.username;
      }
    }
    creator = nft.from_account.user.username;
    if (creator === "NullAddress") {
      creator = "No Username";
    }
    return creator;
  };

  return (
    <div className="nft-item">
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
            Created By: <span className="meta-bold">{setCreator()}</span>
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
      <Link
        to={
          "/details/" +
          nft.asset.asset_contract.address +
          "/" +
          nft.asset.token_id
        }
      >
        Select
      </Link>
      <br></br>
    </div>
  );
};

export default NFTITem;
