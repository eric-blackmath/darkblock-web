// import React from "react";

// class OpenSea extends React.Component {
//   componentDidMount() {
//     //   const apiUrl =
//     //     "https://api.opensea.io/api/v1/events?account_address=0x1fa2e96809465732c49f00661d94ad08d38e68df&event_type=created&only_opensea=false&offset=0&limit=20";
//     //   fetch(apiUrl)
//     //     .then((response) => response.json())
//     //     .then((data) => console.log("OpenSea NFT's", data));
//     const fetch = require("node-fetch");

//     const url =
//       "https://api.opensea.io/api/v1/events?account_address=0x1fa2e96809465732c49f00661d94ad08d38e68df&event_type=created&only_opensea=false&offset=0&limit=20";
//     const options = { method: "GET" };

//     fetch(url, options)
//       .then((res) => res.json())
//       .then((json) => console.log(json))
//       .catch((err) => console.error("error:" + err));
//   }

//   render() {
//     return <div>

//     </div>;
//   }
// }
// export default OpenSea;

// import React, { Component } from 'react'
// import axios from 'axios'

import React, { Component } from "react";
import axios from "axios";
import "../App.scss";
// import $ from "jquery"

export default class OpenSea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "",
    };
  }

  getData() {
    axios
      .get(
        "https://api-mainnet.rarible.com/marketplace/api/v1/ownerships/0x212bd7ec0afc0ca712f6ad7b462acfa00662dd6c%3A42%3A0xb3dbf8b63970b4441a6b3d883f3921ebb4aa662d"
        // "https://api.rarible.com/protocol/v0.1/ethereum/nft/items/byCreator?creator=0xbc355f371084200cd177131154ca8829fba0e623"
        // "https://api.opensea.io/api/v1/events?account_address=0x1fa2e96809465732c49f00661d94ad08d38e68df&event_type=created&only_opensea=false&offset=0&limit=10"
      )
      .then((res) => {
        console.log(res.data);
        var data = res.data.item;
        var loopData = "";
        var i;
        for (i = 0; i < data.length; i++) {
          loopData += `<form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data">
          <div>
          <input type="file" name="file">
          <p>hello</p>
          <img id="file" key="file" name="file" src=${data[i].properties.imagePreview} alt="file" />
          <p>${data[i].id}</p>
          </div>
          <input type="submit" value="submit" />
          </form>`;
        }
        console.log(loopData);
        this.setState({ images: loopData });
      });
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    console.log();
    return (
      <>
        <div
          // className="nft-grid"
          dangerouslySetInnerHTML={{ __html: this.state.images }}
        ></div>
      </>
    );
  }
}
