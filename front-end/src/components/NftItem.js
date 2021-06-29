import React from "react";
import { Link } from "react-router-dom";

import "../App.scss";
import Card from "react-bootstrap/Card";

const NFTITem = ({
  nft,
  nftMeta,
  user,
  selectionHandler,
  nftIndex,
  darkblocked,
}) => {
  var handleToUpdate = selectionHandler;
  console.log(nftMeta);
  return (
    <div className="nft-item">
      <Card>
        <div className="image-container">
          <Card.Img
            className="preview-image"
            variant="top"
            src={nftMeta.image.url.PREVIEW}
          />
        </div>
        <Card.Body>
          <Card.Title className="nft-title">{nftMeta.name}</Card.Title>
          <Card.Text className="meta-data">Created By: <span className="meta-bold">{user.name}</span></Card.Text>
          <Card.Text className="meta-data">Owned By: <span className="meta-bold">{user.name}</span></Card.Text>
        </Card.Body>
      </Card>
          {/* <button onClick={() => handleToUpdate(nftIndex)}>Select</button> */}
          <Link to={"/details/" + nft.id}>Select</Link>
          <br></br>
        </div>
  );
};

export default NFTITem;
