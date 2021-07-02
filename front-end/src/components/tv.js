import React from "react";

import "../App.scss";
// import $ from "jquery";
// import axios from "axios";
import qs from 'qs'
import axios from 'axios'

class Nav extends React.Component {

  componentDidMount() {

  }

  
postTv = () => {
    console.log("tv login");
    axios({
        method: 'post',
        url: 'https://dev1.darkblock.io/api/codeset',
        data: qs.stringify({
          wallet: 'value1',
          code: 'value2',
          session_token: 'value3'
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      })
}

  render() {
    return (
      <div className="tv-login">
        <input
          id="code"
          autoComplete="off"
          className="pin-input"
          placeholder="Enter your PIN here"
        />
        <button style={{cursor:"pointer"}} className="submit submit-wallet" onClick={this.postTv}>
          Login
        </button>
      </div>
    );
  }
}

export default Nav;
