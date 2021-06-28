import React from "react";

import "../App.scss";
import Card from "react-bootstrap/Card";

const NFTITem = ({ nftMeta, selectionHandler, nftIndex }) => {
  var handleToUpdate = selectionHandler;
  console.log(nftMeta);
  return (
    <div className="nft-item">
      <Card style={{ width: "18rem" }}>
        <div className="image-container">
          <Card.Img
            className="preview-image"
            variant="top"
            src={nftMeta.image.url.PREVIEW}
          />
        </div>
        <Card.Body>
          <Card.Title className="nft-title">{nftMeta.name}</Card.Title>
          <Card.Text>Created By</Card.Text>
          <Card.Text>Owned By</Card.Text>
        </Card.Body>
      </Card>
      {/* <button onClick={() => handleToUpdate(nftIndex)}>Select</button> */}
      {/* <section className="main--container">
        <div style={{maxWidth:"280px"}}>
        <article className="card">
          <div className="image-container">
          <img className="preview-image" alt="nft" src={nftMeta.image.url.PREVIEW} />
          
          </div>
          <article className="content">
            <p className="nft-title">{nftMeta.name}</p>
            <p className="nft-title">{nftMeta.creator}</p>
          </article>
        </article>
        </div>
        <div>
        </div>
      </section> */}
    </div>
  );
};

export default NFTITem;
