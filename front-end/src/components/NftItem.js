import React from "react";
import { Link } from "react-router-dom";
import "../App.scss";
import Card from "react-bootstrap/Card";
import noImage from "../resources/static/assets/uploads/no_image.png";

const NFTITem = ({ nft, innerRef }) => {
  return (
    <div className="nft-item" ref={innerRef}>
      <Link to={"/details/" + nft.contract + "/" + nft.token}>
        <Card>
          <div className="image-container">
            <Card.Img
              alt="darkblock image"
              className="preview-image"
              variant="top"
              src={nft.image ? nft.image : noImage}
            />
          </div>
          <Card.Body>
            <Card.Title data-testid="nft-title" className="nft-title">
              {nft.name}
            </Card.Title>
            <Card.Text className="meta-data card-limit">
              Created By: <span className="meta-bold">{nft.creator}</span>
            </Card.Text>
            <Card.Text className="meta-data card-limit">
              Owned By: <span className="meta-bold">{nft.owner}</span>
            </Card.Text>
            <Card.Text className="meta-data db-box">
              {nft.is_darkblocked ? (
                <span className="isdarkblock">
                  Protected By <span className="db-bold">Darkblock</span>
                </span>
              ) : (
                <span className="nodarkblock">No Darkblock Found</span>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
      <br></br>
    </div>
  );
};

export default NFTITem;
