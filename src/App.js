import React from "react";
// import MetaMaskLoginButton from 'react-metamask-login-button';

import Metamask from "../src/components/metamask";
import Opensea from "../src/components/opensea";
import Form from "../src/components/form";
import ImagePreview from "../src/components/imagePreview";
import Upload from "../src/components/arweave";

function App() {
  return (
    <div className="container">
      <Metamask />
      <ImagePreview />
      <Opensea />
      <Form />
      <Upload />
    </div>
  );
}

export default App;
