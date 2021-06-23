import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
//Logs user into metamask and fetches their account address
export default function Login({ setAddress }) {
  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const ethereum = window.ethereum;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    setAddress(account); //when address is set, user is redirected to dashboard
  };

  return (
    <div className="nav">
      <div>
        <img src={logo} alt="darkblock logo" />
      </div>
      <div className="nav-content">
        <button onClick={getAccount} className="login-button">
          <img className="wallet-icon" src={wallet} alt="wallet icon" />
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
