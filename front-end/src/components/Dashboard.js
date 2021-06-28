import React from "react";
import "../App.scss";
import * as RaribleApi from "../api/rarible-api";
import * as NodeApi from "../api/node-api";
import NFTItem from "./NftItem";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: this.props.address, //we have account address from metamask login here
      nfts: [],
      nftsMeta: [],
      selectedNftIndex: "",
      showFileChooser: false,
      file: "",
      fileName: "",
    };

    this.selectionHandler = this.selectionHandler.bind(this);
  }

  componentDidMount() {
    var nftsTemp = [];

    RaribleApi.getNfts(this.state.accountAddress).then((res) => {
      //handle the nfts | extract data for the nft verification

      var data = res.items;

      this.setState({ nfts: data });

      for (var i = 0; i < data.length; i++) {
        // console.log(`NFT : ${JSON.stringify(data[i])}`);
        //
        RaribleApi.getNftMetaById(data[i].id).then((data) => {
          //handle the meta-data of nfts
          // console.log(`Nft Meta : ${JSON.stringify(data)}`);
          nftsTemp.push(data);
          this.setState({ nftsMeta: nftsTemp });
        });
      }
    });
  }

  selectionHandler(nftIndex) {
    //nft is selected
    this.setState({
      selectedNftIndex: nftIndex,
      showFileChooser: true, //enables the file choose
    });

    console.log(`NFT Selected : ${this.state.selectedNftIndex}`);
  }

  onChange = (e) => {
    //file is picked
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", this.state.file);
    data.append(
      "contract",
      this.state.nfts[this.state.selectedNftIndex].contract
    );
    data.append("token", this.state.nfts[this.state.selectedNftIndex].tokenId);
    data.append("wallet", this.state.accountAddress);

    try {
      NodeApi.postTransaction(data).then((data) => {
        //handle the response
        console.log(`Message : ${data.message}`);
      });
    } catch (err) {
      //catch some errors here
      console.log(e);
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.showFileChooser ? (
          <form onSubmit={this.onSubmit}>
            <div className="custom-file mb-4">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={this.onChange}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {this.state.filename}
              </label>
            </div>

            <input
              type="submit"
              value="Upload"
              className="btn btn-primary btn-block mt-4"
            />
          </form>
        ) : null}

        <ul className="list-group nft-item">
          {this.state.nftsMeta.map((listitem) => (
            <NFTItem
              key={this.state.nftsMeta.indexOf(listitem)}
              nftMeta={listitem}
              nftIndex={this.state.nftsMeta.indexOf(listitem)}
              selectionHandler={this.selectionHandler}
            />
          ))}
        </ul>
      </React.Fragment>
    );
  }
}
