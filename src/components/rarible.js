import React from "react";

import axios from "axios";
// import { data } from 'jquery';

export default class Rarible extends React.Component {
  state = {
    properties: [],
  };

  componentDidMount() {
    // axios.get(`https://api.rarible.com/protocol/v0.1/ethereum/nft/items/0xef68b66ebc4840bd4f31ea435bf6373962d3080a`)
    axios
      .get(
        `https://api-mainnet.rarible.com/marketplace/api/v1/ownerships/0x212bd7ec0afc0ca712f6ad7b462acfa00662dd6c%3A42%3A0xb3dbf8b63970b4441a6b3d883f3921ebb4aa662d`
      )


      .then((res) => {
        console.log(res.data);
        const name = res.data.properties.name;
        const image = res.data.properties.imageBig;
        this.setState({ image });
        this.setState({ name });
        var loopData = "";
        // var data = res.data.items.id;
        // this.setState({ id });
        var i;
        // for (i = 0; i < data.length; i++) {
        //   loopData += `<form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data">
        //   <div>
        //   <input type="file" name="file">
        //   <p>hello</p>
        //   <p>${data[i].items.id}</p>
        //   </div>
        //   <input type="submit" value="submit" />
        //   </form>`;
        // }
        // console.log(loopData);
        
      });
  }

  render() {
    return (
      <>
        <p>{this.state.name}</p>
        <div>
            <img src={this.state.image} alt="nft" />
          </div>
      </>
    );
  }
}
