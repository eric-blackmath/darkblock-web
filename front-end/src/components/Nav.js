import React from "react";

import "../App.scss";
import logo from "../images/logo.png";
import wallet from "../images/wallet.svg";
import $ from "jquery";
import { useEffect } from "react";
import * as LoginUtil from "../util/login-util";
import { useHistory } from "react-router-dom";
import * as MetamaskUtil from "../util/metamask-util";

export default function Nav({ setAddress, address }) {
  let history = useHistory();

  useEffect(() => {
    setNavigation();
  }, []);

  function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);

    $(".nav a").each(function () {
      var href = $(this).attr("href");
      if (path.substring(0, href.length) === href) {
        $(this).closest(".nav-link").addClass("active");
      }
    });
  }

  const handleLogOut = () => {
    LoginUtil.logOutUser();
    setAddress("");
    history.push("/home");
  };

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

  return (
    <div className="nav">
      {address ? (
        <div>
          <div>
            <a href="/">
              <img className="nav-logo" src={logo} alt="darkblock logo" />
            </a>
          </div>
          <div className="nav-content">
            <a className="nav-link" href="/nfts/all">
              {" "}
              <h2 className="nav-item">My NFT's</h2>
            </a>
            <a className="nav-link" href="/nfts/createdbyme">
              <h2 className="nav-item">Created By Me</h2>
            </a>
            <button onClick={handleLogOut}>LogOut</button>
            <img src={wallet} alt="wallet icon" />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
