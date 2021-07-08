import React from "react";
import wallet from "../images/wallet.svg";
import logo from "../images/dark-logo.svg";
import * as RaribleApi from "../api/rarible-api";
import * as MetamaskUtil from "../util/metamask-util";

import Web3 from "web3";
import sigUtil from "eth-sig-util";
var ethUtil = require("ethereumjs-util");

//Logs user into metamask and fetches their account address
export default function Login({ setAddress, setUser }) {
  const ethereum = window.ethereum;
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");

  const getAccount = async () => {
    //handle the case of when metamask is not installed

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // const user = await fetchUserProfile(account);

      // console.log(`Login User : ${user.name}`);
      // setUser(user);
      setAddress(account); //when address is set, user is redirected to dashboard

      const respo = await MetamaskUtil.signData(
        "Testing the signature, dont mind me",
        account
      );

      console.log(`${respo}`);

      return;

      // await signMsg("this string", account);
      localStorage.setItem("accountAddress", account);
    } catch (e) {
      alert(`Please make sure you have Metamask installed : ${e.message}`);
    }
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
