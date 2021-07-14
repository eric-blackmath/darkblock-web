import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
import * as RaribleApi from "../api/rarible-api";
import * as MetamaskUtil from "../util/metamask-util";
import * as LoginUtil from "../util/login-util";
import { useHistory } from "react-router-dom";
import "../styles/home.scss";

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

  const redirectToNFts = () => {
    history.push("/nfts/all");
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
    <div>
      <div className="home-page">
        <div className="home-hero">
          <h1>Give superpowers to your NFTs!</h1>
          <p>(for free)<span>*</span></p>
        </div>
      </div>
    </div>
  );
}
