import React from "react";

import "../App.scss";
import logo from "../images/beta-logo.svg";
import wallet from "../images/wallet.svg";
import $ from "jquery";
import { useEffect } from "react";
import * as LoginUtil from "../util/login-util";
import { NavLink, useHistory } from "react-router-dom";
import * as MetamaskUtil from "../util/metamask-util";
import { useLocation } from "react-router-dom";

export default function Nav({ setAddress, address }) {
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {}, []);

  const handleLogOut = () => {
    LoginUtil.logOutUser();
    setAddress("");
    history.push("/");
  };

  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const address = await MetamaskUtil.signInAndGetAccount();
    if (address) {
      setAddress(address); //when address is set, user is redirected to dashboard
      LoginUtil.keepUserLoggedIn(address);
      if (location.pathname === "/tv") {
        //dont redirect
      } else {
        redirectToNFts();
      }
    } else {
      alert(
        "Login Failed! Please make sure you have Metamask extension enabled."
      );
    }
  };

  const redirectToNFts = () => {
    history.push("/nfts/createdbyme");
  };

  return (
    <div className="nav">
      {address ? (
        <div className="nav">
          <a href="/nfts/createdbyme">
            <img className="nav-logo" src={logo} alt="darkblock logo" />
          </a>
          {location.pathname === "/tv" ? null : (
            <div className="nav-content">
              <h2 className="nav-link nav-item">
                <NavLink
                  exact
                  className="nav-link"
                  activeClassName="active"
                  to="/nfts/createdbyme"
                >
                  Created By Me
                </NavLink>
              </h2>
              <h2 className="nav-link nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/nfts/all"
                >
                  My NFT's
                </NavLink>
              </h2>
              <div className="dropdown">
                <button className="dropbtn">
                  {" "}
                  <img src={wallet} alt="wallet icon" />
                </button>
                <div className="dropdown-content">
                  <p onClick={handleLogOut}>Log out</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="nav">
          <div>
            <img
              className="nav-logo-loggedout"
              src={logo}
              alt="darkblock logo"
            />
          </div>
          <div className="nav-content">
            <div className="login-container">
              <button onClick={getAccount} className="login-button">
                <img className="wallet-icon" src={wallet} alt="wallet icon" />
                <span style={{paddingTop:"3px"}}>Connect Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
