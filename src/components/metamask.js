import React, { useState } from "react";
// import MetaMaskLoginButton from 'react-metamask-login-button';

import "../App.scss";

function Metamask() {
  const ethereum = window.ethereum;
  const [addr, setAddr] = useState("");

  if (ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      setAddr(accounts[0]);
    });
  }

  return (
    <div>
      <h1>Ethereum Wallet - Metamask</h1>
      {ethereum && <p>Your ethereum address: {addr}</p>}
      {/* <MetaMaskLoginButton /> */}
    </div>
  );
}

export default Metamask;
