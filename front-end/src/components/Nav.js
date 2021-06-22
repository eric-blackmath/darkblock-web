import React from "react";

import "../App.scss";
import logo from "../images/dark-logo.svg"
import wallet from "../images/wallet.svg"

export default class Nav extends React.Component {
  render() {
    return (
      <div className="nav">
          <div>
          <img src={logo} alt="darkblock logo" />
          </div>
          <div className="nav-content">
              <h2 className="nav-item">My NFT's</h2>
              <h2 className="nav-item">Created By Me</h2>
              <img src={wallet} alt="wallet icon" />
          </div>
      </div>
    );
  }
}