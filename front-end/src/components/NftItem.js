import React from "react";

import "../App.scss";

const NFTITem = ({ nftMeta, selectionHandler, nftIndex }) => {
  var handleToUpdate = selectionHandler;

  return (
    <div className="nft-item">
      <h2>NFTItem</h2>
      <div>
        <img alt="preview-img" src={nftMeta.image.url.PREVIEW} />
        <div>
          <input class="nft-title" readOnly value={nftMeta.name} />
          <input class="nft-desc" readOnly value={nftMeta.description} />
        </div>
        <div>
          <button onClick={() => handleToUpdate(nftIndex)}>Select</button>
        </div>
      </div>
    </div>
  );
};

export default NFTITem;
