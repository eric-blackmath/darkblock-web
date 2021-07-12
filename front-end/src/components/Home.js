import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
import * as RaribleApi from "../api/rarible-api";
import * as MetamaskUtil from "../util/metamask-util";
import * as LoginUtil from "../util/login-util";
import { useHistory } from "react-router-dom";

//Logs user into metamask and fetches their account address
export default function Home({ setAddress }) {
  let history = useHistory();

  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const address = await MetamaskUtil.signInAndGetAccount();
    setAddress(address); //when address is set, user is redirected to dashboard
    LoginUtil.keepUserLoggedIn(address);
    redirectToNFts();
  };

  const fetchUserProfile = async (account) => {
    try {
      const user = await RaribleApi.getUserProfile(account);
      return user;
    } catch (e) {
      console.log(e);
    }
  };

  const redirectToNFts = () => {
    history.push("/nfts/all");
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
