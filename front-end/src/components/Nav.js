import React from "react";

import "../App.scss";
import logo from "../images/logo.png";
import wallet from "../images/wallet.svg";
import $ from "jquery";

class Nav extends React.Component {
  componentDidMount() {
    $(function () {
      setNavigation();
  });
  
  function setNavigation() {
      var path = window.location.pathname;
      path = path.replace(/\/$/, "");
      path = decodeURIComponent(path);
  
      $(".nav a").each(function () {
          var href = $(this).attr('href');
          if (path.substring(0, href.length) === href) {
              $(this).closest('.nav-link').addClass('active');
          }
      });
  }
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
          <a className="nav-link" href="/nfts/all">
            {" "}
            <h2 className="nav-item">My NFT's</h2>
          </a>
          <a className="nav-link" href="/nfts/createdbyme">
            <h2 className="nav-item">Created By Me</h2>
          </a>
          <img src={wallet} alt="wallet icon" />
        </div>
      </div>
    );
  }
}

export default Nav;
