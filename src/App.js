import React from "react";
// import MetaMaskLoginButton from 'react-metamask-login-button';

import Metamask from '../src/components/metamask'
import Opensea from '../src/components/opensea'
import Form from '../src/components/form'

function App() {

  return (
    <div className="container">
      <Metamask />
      <Opensea />
      <Form />
    </div>

  ); 
}

export default App;
