import React from "react";

import axios from "axios";
import "../App.scss";

export default class Axios extends React.Component {
  state = {
    properties: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      images: "",
    };
  }

  componentDidMount() {
    axios
      .get(
        `https://api.rarible.com/protocol/v0.1/ethereum/nft/items/byCreator?creator=0xbc355f371084200cd177131154ca8829fba0e623`
      )

      .then(async (res) => {
        console.log(res.data);
        var i;
        var loopData = "";
        var data = res.data.items;
        for (i = 0; i < data.length; i++) {
          var ret = await axios.get(
            "https://api.rarible.com/protocol/v0.1/ethereum/nft/items/" +
              data[i].id +
              "/meta"
          );
          console.log(ret);
          loopData += `<form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data">
                 <div> 
                  <img src=${ret.data.image.url.PREVIEW} />
                  <div>
                  <input class="nft-title" readOnly value="${ret.data.name}" />
                  </div>
                  <div>
                  <input type="file" name="file" />
                  <input type="submit" value="submit" />
                  </div>
                  </div>
                  </form>`;
        }
        // console.log(loopData);
        this.setState({ images: loopData });
      });
  }

  render() {
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
