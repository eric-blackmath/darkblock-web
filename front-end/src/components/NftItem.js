import React from "react";
import { Link } from "react-router-dom";
import "../App.scss";
import Card from "react-bootstrap/Card";

const NFTITem = ({ nft, selectionHandler, darkblocked }) => {
  var handleToUpdate = selectionHandler;

  const setName = () => {
    if (!nft.name) {
      return nft.collection.name;
    }
    return `${nft.name}`;
  };

  const setOwner = () => {
    var owner = "";
    if (nft.owner.user.username === "NullAddress") {
      owner = nft.creator.user.username;
    } else {
      owner = nft.owner.user.username;
    }
    if (owner === "NullAddress") {
      owner = "No Username";
    }
    return owner;
  };

  const setCreator = () => {
    //sometimes the creator.user + creator.user.username is null
    var creator = "";
    if (!nft.creator.user) {
      //creator is missing in all of em, (without event_type)
      creator = nft.owner.user.username;
    } else if (!nft.creator.user.username) {
      creator = nft.owner.user.username;
    } else {
      creator = nft.creator.user.username;
    }

    if (creator === "NullAddress") {
      creator = "No Username";
    }
    return creator;
  };

  return (
    <div className="nft-item">
      {/* <Card>
        <div className="image-container">
          <Card.Img
            className="preview-image"
            variant="top"
            src={nft.image_preview_url}
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
      </Card> */}
      {/* <button onClick={() => handleToUpdate(nftIndex)}>Select</button> */}
      <Link to={"/details/" + nft.asset_contract.address + "/" + nft.token_id}>
        <Card>
          <div className="image-container">
            <Card.Img
              className="preview-image"
              variant="top"
              src={nft.image_preview_url}
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
            <Card.Text className="meta-data isdarkblock">
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
