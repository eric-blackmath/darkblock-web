import React from "react";
import "../App.scss";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";
import * as DarkblockApi from "../api/darkblock-api";
import * as MetamaskUtil from "../util/metamask-util";

export default function TvLogin() {
  const address = useContext(UserContext);
  const [code, setCode] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    console.log(`Tv login triggered : ${address}`);
    checkIfUserLoggedIn();
    return;
  }, []);

  const checkIfUserLoggedIn = () => {
    if (!address) {
      setIsUserLoggedIn(false);
    }
  };
  const onSubmit = async () => {
    try {
      if (!isUserLoggedIn) {
        //make him login, then send the code
        var submitResponse;
        const address = await MetamaskUtil.signInAndGetAccount();
        if (address) {
          submitResponse = await submitCode(address);
        }
      } else {
        submitResponse = await submitCode(address);
      }

      if (submitResponse.status === 200) {
        //code submitted succesfully
        console.log(`Code Submitted, Redirecting you somewhere`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnCodeChange = (e) => {
    setCode(e.target.value);
  };

  const submitCode = async (address) => {
    const sessionToken = await getSignedSession(address);
    return DarkblockApi.confirmTvLogin(code, address, sessionToken);
  };

  const getSignedSession = async (address) => {
    const epoch = Date.now(); // Unix timestamp in milliseconds
    var sessionToken = epoch + address;
    const signature = await MetamaskUtil.signTypedData(sessionToken, address);
    return epoch + "_" + signature;
  };

  return (
    <div className="tv-login">
      <input
        id="code"
        autoComplete="off"
        className="pin-input"
        placeholder="Enter your PIN here"
        value={code}
        maxLength="6"
        pattern="[0-9]*"
        onChange={handleOnCodeChange}
      />

      {!isUserLoggedIn ? (
        <button type="button" onClick={onSubmit} className="btn">
          Confirm and Connect Wallet
        </button>
      ) : (
        <button type="button" onClick={onSubmit} className="btn">
          Confirm
        </button>
      )}
    </div>
  );
}
