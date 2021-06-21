import React from "react";

import "../App.scss";

export default class NFTITem extends React.Component {

  render() {
    return (

        <div className="nft-item" >

            <h2>NFTItem</h2>
            <form action="http://localhost:5000/upload" key="file" method="POST" encType="multipart/form-data">
            <div> 
            <img alt="preview-img" src={this.props.nft.image.url.PREVIEW} />
            <div>
            <input class="nft-title" readOnly value={this.props.nft.name} />
            <input class="nft-desc" readOnly value={this.props.nft.description} />
            </div>
            <div>
            <input type="file" name="file" accept="image/*" />
            <input type="submit" value="submit" />
            </div>
            </div>
            </form>

    </div>
        );
  }
}
