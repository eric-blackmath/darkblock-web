import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
import * as RaribleApi from "../api/rarible-api";
import web3 from "web3";
import sigUtil from "eth-sig-util";
var ethUtil = require("ethereumjs-util");

//Logs user into metamask and fetches their account address
export default function Login({ setAddress, setUser }) {
  const ethereum = window.ethereum;

  const getAccount = async () => {
    //handle the case of when metamask is not installed

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      const user = await fetchUserProfile(account);

      // signMsg("this string", account);

      console.log(`Login User : ${user.name}`);
      setUser(user);
      setAddress(account); //when address is set, user is redirected to dashboard
    } catch (e) {
      alert("Please make sure you have Metamask installed");
    }
  };

  function signMsg(msgParams, from) {
    var msgHash = ethUtil.keccak256(msgParams);

    window.web3.eth.personal.sign(from, msgHash, function (err, result) {
      if (err) return console.error(err);
      console.log("SIGNED:" + result);
    });
    // web3.currentProvider.sendAsync(
    //   {
    //     method: "eth_signTypedData",
    //     params: [msgParams, from],
    //     from: from,
    //   },
    //   function (err, result) {
    //     if (err) return console.error(err);
    //     if (result.error) {
    //       return console.error(result.error.message);
    //     }
    //     const recovered = sigUtil.recoverTypedSignature({
    //       data: msgParams,
    //       sig: result.result,
    //     });
    //     if (recovered === from) {
    //       alert("Recovered signer: " + from);
    //     } else {
    //       alert("Failed to verify signer, got: " + result);
    //     }
    //   }
    // );
  }

  const fetchUserProfile = async (account) => {
    try {
      const user = await RaribleApi.getUserProfile(account);
      return user;
    } catch (e) {
      console.log(e);
    }
  };

  return (
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
  );
}
