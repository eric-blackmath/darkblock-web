import React from "react";

import axios from "axios";
import "../App.scss"
// import { data } from 'jquery';

export default class Image extends React.Component {
  state = {
    properties: [],
  };

  componentDidMount() {
    axios
      .get(
        `https://api-mainnet.rarible.com/marketplace/api/v1/ownerships/0x212bd7ec0afc0ca712f6ad7b462acfa00662dd6c%3A42%3A0xb3dbf8b63970b4441a6b3d883f3921ebb4aa662d`
      )

      .then((res) => {
        console.log(res.data);
        const image = res.data.properties.imageBig;
        this.setState({ image });
        var loopData = "";
        var data = res.data.properties.imageBig;
        // this.setState({ id });
        // var i;
        // for (i = 0; i < data.length; i++) {
        //   loopData += `<form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data">
        //   <div>
        //   <img id="file" key="file" name="file" src="${data[i].image}" alt="file" />
        //   </div>
        //   <input type="submit" value="submit" />
        //   </form>`;
        // }
        // console.log(loopData);
      });
    // .then((res) => {
    //     console.log(res.data);
    //     var data = res.data.item;
    //     var loopData = "";
    //     // this.setState({ id });
    //     var i;
    //     for (i = 0; i < data.length; i++) {
    //       loopData += `<form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data">
    //       <div>
    //       <input type="file" name="file">
    //       <p>hello</p>
    //       <p>${data[i].properties.name}</p>
    //       </div>
    //       <input type="submit" value="submit" />
    //       </form>`;
    //     }
    //     console.log(loopData);
    //     this.setState({ id: loopData });
    //   });
  }

  render() {
    return (
      <>
        {/* <div
        //   className="nft-grid"
          dangerouslySetInnerHTML={{ __html: this.state.image}}
        >
        </div> */}
        {/* <form
          action="http://localhost:8080/upload"
          key="file"
          method="post"
          encType="multipart/form-data"
        >
          <div>
            <img src={this.state.image} alt="nft" />
          </div>
          <div>
            <input type="file" name="file" />
            <div>
              <input type="submit" value="submit" />
            </div>
          </div>
        </form> */}
      </>
    );
  }
}
