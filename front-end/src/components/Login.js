import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
import * as RaribleApi from "../api/rarible-api";

//Logs user into metamask and fetches their account address
export default function Login({ setAddress, setUser }) {
  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const ethereum = window.ethereum;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const user = await fetchUserProfile(account);

    console.log(`Login User : ${user.name}`);
    setUser(user);
    setAddress(account); //when address is set, user is redirected to dashboard
  };

  const fetchUserProfile = async (account) => {
    try {
      const user = await RaribleApi.getUserProfile(account);
      return user;
    } catch (e) {
      console.log(e);
    }
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
