import React from "react";
import { Link } from "react-router-dom";
import "../App.scss";
import Card from "react-bootstrap/Card";
import noImage from "../resources/static/assets/uploads/no_image.png";

const NFTITem = ({ nft }) => {
  return (
    <div className="nft-item">
      <Link to={"/details/" + nft.contract + "/" + nft.token}>
        <Card>
          <div className="image-container">
            <Card.Img
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
            <Card.Text className="meta-data isdarkblock">
              <span className="meta-bold">
                {nft.is_darkblocked
                  ? "Protected by Darkblock"
                  : "No Darkblock found"}
              </span>
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
      <br></br>
    </div>
  );
};

export default NFTITem;
