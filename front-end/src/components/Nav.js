import React from "react";

import "../App.scss";
import logo from "../images/logo.png";
import wallet from "../images/wallet.svg";

class Nav extends React.Component {
  componentDidMount() {
    
  }

  render() {
    return (
      <div className="nav">
        <div>
          <a href="/">
            <img className="nav-logo" src={logo} alt="darkblock logo" />
          </a>
        </div>
        <div className="nav-content">
          <a className="nav-link active-link" href="/dashboard">
            {" "}
            <h2 className="nav-item">My NFT's</h2>
          </a>
          <a className="nav-link" href="/dashboard">
            <h2 className="nav-item">Created By Me</h2>
          </a>
          <img src={wallet} alt="wallet icon" />
        </div>
      </div>
    );
  }
}

export default Nav;
