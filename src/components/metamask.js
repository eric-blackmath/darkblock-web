import React from "react";

// import MetaMaskLoginButton from 'react-metamask-login-button';

import "../App.scss";
// const Web3 = require("web3");

// const ethEnabled = async () => {
//   if (window.ethereum) {
//     await window.ethereum.request('eth_requestAccounts');
//     window.web3 = new Web3(window.ethereum);
//     return true;
//   }
//   return false;
// }

// if (!ethEnabled()) {
//   alert("Please install MetaMask to use this dApp!");
// }

function Metamask() {
  // const ethereum = window.ethereum;
  // const [addr, setAddr] = useState("");

  // if (ethereum) {
  //   ethereum.on("accountsChanged", function (accounts) {
  //     setAddr(accounts[0]);
  //   });
  // }
  const ethereum = window.ethereum;

  const ethereumButton = document.querySelector(".enableEthereumButton");
  const showAccount = document.querySelector(".showAccount");

  async function getAccount() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    showAccount.innerHTML = account;
  }
  
  
  ethereumButton.addEventListener("click", () => {
    getAccount();
  });


  ethereum.request({ method: "eth_requestAccounts" });

  return (
    <div>
      {/* <h1>Ethereum Wallet - Metamask</h1>
      {ethereum && <p>Your ethereum address: {addr}</p>}
      <MetaMaskLoginButton /> */}
      <button onClick={getAccount()} className="enableEthereumButton">Enable Ethereum</button>
      <h2>
        Account: <span className="showAccount"></span>
      </h2>
    </div>
  );

}

export default Metamask;
