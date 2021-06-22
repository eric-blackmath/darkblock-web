import React from "react";

import "../App.scss";
import logo from "../images/dark-logo.svg"

export default class Nav extends React.Component {
  render() {
    return (
      <div className="nav">
        <img src={logo} alt="darkblock logo" />
      </div>
    );
  }
}