import React, { Component } from "react";
import "../App.scss";
// import $ from "jquery";
import Arweave from 'arweave';


class arweaveUpload extends Component {
  componentDidMount() {
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 1984,
        protocol: 'http'
    });

    let data = fs.readFileSync('path/to/file.pdf');
let transaction = await arweave.createTransaction({ data: data }, key);
transaction.addTag('Content-Type', 'application/pdf');
await arweave.transactions.sign(transaction, key);
let uploader = await arweave.transactions.getUploader(transaction);
while (!uploader.isComplete) {
  await uploader.uploadChunk();
  console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
}

const response = await arweave.transactions.post(transaction);
    return (
      <div className="App">
      
      </div>
    );
  }
}

export default arweaveUpload;
