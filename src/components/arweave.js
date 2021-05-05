import React, { Component } from "react";
import "../App.scss";
import Arweave from 'arweave';

const fs = require('fs');
var wallet;
var key;

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 1984,
  protocol: 'http'
});

class Upload extends Component {
  async componentDidMount() {

    let walletFile = fs.readFileSync('path/to/wallet.json');//to wallet file
    wallet = JSON.parse(walletFile);
    key = await arweave.wallets.jwkToAddress(wallet);

    let data = fs.readFileSync('path/to/file.pdf');//this is being uploaded
    let transaction = await arweave.createTransaction({ data: data }, key);
    // transaction.addTag('Content-Type', 'application/pdf');
    await arweave.transactions.sign(transaction, key);
    
    const response = await arweave.transactions.post(transaction);
    console.log(response.status);

  }
  render() {
    return (
      <div className="arweave-upload">
        <div></div>
      </div>
    );
  }
}


export default Upload;