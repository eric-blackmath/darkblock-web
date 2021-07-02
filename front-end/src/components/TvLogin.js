import React from "react";
import "../App.scss";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";
import * as DarkblockApi from "../api/darkblock-api";

export default function Dashboard() {
  const user = useContext(UserContext);
  const [code, setCode] = useState("");

  useEffect(() => {
    console.log(`Tv login triggered`);
  }, []);
  const onSubmit = () => {
    console.log(`Code : ${code}`);
    const sessionToken = Date.now() + user.id; // Unix timestamp in milliseconds
    //sessionToken : sign with Metamask. take the epoch, append _ and then the signature to create the session token.
    console.log(`Session Token: ${sessionToken}`);

    DarkblockApi.confirmTvLogin(code, user.id, sessionToken);
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
