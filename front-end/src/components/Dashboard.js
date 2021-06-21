import React from "react";

import "../App.scss";
import * as RaribleApi from '../api/rarible-api'
import NFTItem from './NftItem'

export default class Dashboard extends React.Component {


  state = {
    properties: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      accountAddress: this.props.address //we have account address from metamask login here
    };
  }


  componentDidMount() {

    var nfts = [];

    RaribleApi.getNfts(this.state.accountAddress).then((res) =>{

      //handle the nfts | extract data for the nft verification
      var data = res.items

      for (var i=0; i<data.length; i++){

        //
        RaribleApi.getNftMetaById(data[i].id).then((data) => {

          //handle the meta-data of nfts
          console.log(`Nft Meta Name : ${JSON.stringify(data)}`)
          nfts.push(data) 
          this.setState({ data: nfts });

        })
      }
    })

  }

  render() {
    return (

      <React.Fragment>
        <ul className="list-group">
          {(this.state.data).map(listitem => (
            <NFTItem key={listitem.name + this.state.data.indexOf(listitem)} 
                     nft={listitem} />
          ))}
        </ul>
      </React.Fragment>
      
    );
  }
}
