import React from "react";
import { Link } from "react-router-dom";

import "../App.scss";

const NFTITem = ({
  nft,
  nftMeta,
  user,
  selectionHandler,
  nftIndex,
  darkblocked,
}) => {
  var handleToUpdate = selectionHandler;

  console.log(`is darkblocked: ${darkblocked}: ${nft.contract}:${nft.tokenId}`);

  return (
    <div className="nft-item">
      <div>
        <img alt="preview-img" src={nftMeta.image.url.PREVIEW} />
        <div>
          <div class="nft-title">{nftMeta.name}</div>
          <div class="nft-creator">Created by {user.name}</div>
          <div class="nft-owner">Owned by {user.name}</div>
          <div class="nft-is-darkblocked">
            {darkblocked ? "Protected By Darkblock" : "No Darkblock Found"}
          </div>
        </div>
        <div>
          {/* <button onClick={() => handleToUpdate(nftIndex)}>Select</button> */}
          <Link to={"/details/" + nft.id}>Select</Link>
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default NFTITem;
