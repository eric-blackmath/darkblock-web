import React from "react";
import "../App.scss";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";
import * as DarkblockApi from "../api/darkblock-api";
import * as MetamaskUtil from "../util/metamask-util";

export default function Dashboard() {
  const address = useContext(UserContext);
  const [code, setCode] = useState("");

  useEffect(() => {
    console.log(`Tv login triggered : ${address}`);
    return;
  }, []);
  const onSubmit = async () => {
    try {
      console.log(`Code : ${code}`);
      const epoch = Date.now();
      console.log(`Epoch : ${epoch}`);
      var sessionToken = epoch + address; // Unix timestamp in milliseconds
      //sessionToken : sign with Metamask. take the epoch, append _ and then the signature to create the session token.

      const signature = await MetamaskUtil.signTypedData(sessionToken, address);

      console.log(`Signature : ${signature}`);

      sessionToken = epoch + "_" + signature;

      console.log(
        `code: ${code} \naddress: ${address}\nsession_token :${sessionToken}`
      );
      const confirmRes = await DarkblockApi.confirmTvLogin(
        code,
        address,
        sessionToken
      );

      console.log(`Confirm Response : ${JSON.stringify(confirmRes.data)}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnCodeChange = (e) => {
    setCode(e.target.value);
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

      <button type="button" onClick={onSubmit} className="btn">
        Submit
      </button>
    </div>
  );
}
