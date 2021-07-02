import React from "react";

import "../App.scss";
// import $ from "jquery";
// import axios from "axios";
import qs from 'qs'
import axios from 'axios'

class Nav extends React.Component {

  componentDidMount() {

  }

  
//   postTv = () => {
//     const post = {
//         method: 'POST',

//     };
//     fetch("https://dev1.darkblock.io/api/codeset", post)
//     // .then(response => response.json())
//      .then(function(response) {
//         console.log("It worked, response is: ", response)
//         .then(response => response.json())
//      }).catch(function() {
//         console.log("error");
//      });
// }
  
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


//    pushCode() {
//     console.log("tv login");
//     // let code = document.getElementById("code");
//     // code = code.toUpperCase();
//     // code = code.replace(/\W/g, "");
//     $.post(
//       "https://dev1.darkblock.io/api/codeset"
//     );

//   }
//   handleClick() {
//     console.log("tv login");
//     // let code = document.getElementById("code");
//     // code = code.toUpperCase();
//     // code = code.replace(/\W/g, "");
//     $.post(
//       "https://dev1.darkblock.io/api/codeset"
//     );
//   }
  render() {
    return (
      <div className="tv-login">
        <input
          id="code"
          autoComplete="off"
          className="pin-input"
          placeholder="Enter your PIN here"
        />
        <a style={{cursor:"pointer"}} className="submit submit-wallet" onClick={this.postTv}>
          Login
        </a>
      </div>
    );
  }
}

export default Nav;
