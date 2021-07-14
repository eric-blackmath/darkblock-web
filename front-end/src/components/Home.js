import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
import * as RaribleApi from "../api/rarible-api";
import * as MetamaskUtil from "../util/metamask-util";
import * as LoginUtil from "../util/login-util";
import { useHistory } from "react-router-dom";
import "../styles/home.scss";
import hands from "../images/hands.png";

//Logs user into metamask and fetches their account address
export default function Home({ setAddress }) {
  let history = useHistory();

  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const address = await MetamaskUtil.signInAndGetAccount();
    if (address) {
      setAddress(address); //when address is set, user is redirected to dashboard
      LoginUtil.keepUserLoggedIn(address);
      redirectToNFts();
    }
  };

  const redirectToNFts = () => {
    history.push("/nfts/createdbyme");
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
      <div className="home-page home-container">
        <div className="home-hero">
          <div>
            <h1 className="home-title">Give superpowers to your NFTs!</h1>
            <p className="for-free">
              (for free)<span>*</span>
            </p>
            <div className="login-container">
              <button onClick={getAccount} className="login-button">
                <img className="wallet-icon" src={wallet} alt="wallet icon" />
                Connect Wallet
              </button>
            </div>
          </div>
          <div>
            <img className="hands-image" src={hands} alt="hands" />
          </div>
          <div className="arweave-warning">
          <p>*Uploading to Arweave isn’t free. But we’ve got you covered for now.</p>
          </div>
        </div>

        <div style={{backgroundColor:"black"}} className="home-hero">
          <div>
          <h1 className="home-title">Give superpowers to your NFTs!</h1>
          <p className="for-free">
            (for free)<span>*</span>
          </p>
          <div className="login-container">
              <button onClick={getAccount} className="login-button">
                <img className="wallet-icon" src={wallet} alt="wallet icon" />
                Connect Wallet
              </button>
            </div>
          </div>
          <div>
            <img className="hands-image" src={hands} alt="hands" />
          </div>
          <div className="arweave-warning">
          <p>*Uploading to Arweave isn’t free. But we’ve got you covered for now.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
