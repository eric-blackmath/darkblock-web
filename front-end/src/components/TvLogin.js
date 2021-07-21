import React from "react";
import "../App.scss";
import "../styles/tv.scss";
import { useState, useEffect } from "react";
import * as DarkblockApi from "../api/darkblock-api";
import * as MetamaskUtil from "../util/metamask-util";
import Footer from "../components/footer";

export default function TvLogin({ address }) {
  // const address = useContext(UserContext);
  const [code, setCode] = useState("");
  const [isConnectSuccess, setIsConnectSuccess] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    checkIfUserLoggedIn();
  }, [address]);

  const checkIfUserLoggedIn = () => {
    if (!address) {
      setIsUserLoggedIn(false);
    } else {
      setIsUserLoggedIn(true);
    }
  };

  const onSubmit = async () => {
    try {
      checkIfUserLoggedIn();
      var submitResponse;
      if (isUserLoggedIn === false) {
        //make him login, then send the code
        alert("Please make sure you are logged in first");
      } else {
        submitResponse = await submitCode(address);

        if (submitResponse.status === 200) {
          //code submitted succesfully
          setIsConnectSuccess(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnCodeChange = (e) => {
    setCode(e.target.value);
  };

  const submitCode = async (address) => {
    const signedSessionToken = await getSignedSession(address);
    return DarkblockApi.confirmTvLogin(code, address, signedSessionToken);
  };

  const getSignedSession = async (address) => {
    const epoch = Date.now(); // Unix timestamp in milliseconds
    var sessionToken = epoch + address;
    const signature = await MetamaskUtil.signTypedData(sessionToken);
    return epoch + "_" + signature;
  };

  return (
    <div className="tv-login">
      {isConnectSuccess ? (
        <div className="tv-success tv-height">
          <h1 className="tv-success-text">
          The Darkblock TV App should now be signed in.
          </h1>
          <p className="tv-app-text">Troubles? Please refresh and try again.</p>
        </div>
      ) : (
        <div className="tv-height">
          {" "}
          <h1 className="tv-title">Enter 6 digit code from the TV App to Sign in.</h1>
          <p className="tv-meta">Requires Metamask for wallet verification.</p>
          <div className="tv-code">
            <input
              id="code"
              autoComplete="off"
              className="pin-input"
              placeholder="Please enter code here"
              value={code}
              maxLength="6"
              pattern="[0-9]*"
              onChange={handleOnCodeChange}
            />
          </div>
          <div className="tv-button">
            <button type="button" onClick={onSubmit} className="btn">
              Connect
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
