import React from "react";
import "../App.scss";
import "../styles/tv.scss";
import { useState, useEffect } from "react";
import * as NodeApi from "../api/node-api";
import * as MetamaskUtil from "../util/metamask-util";
import Footer from "../components/footer";

export default function TvLogin({ address }) {
  // const address = useContext(UserContext);
  const [code, setCode] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [connectResponse, setConnectResponse] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    checkIfUserLoggedIn();
    // eslint-disable-next-line
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
        console.log(submitResponse);

        if (submitResponse.status === 200) {
          //code submitted succesfully
          setIsResolved(true);
          setConnectResponse("The Darkblock TV App should now be signed in.");
        }
      }
    } catch (e) {
      setIsResolved(true);

      setConnectResponse("Login Failed! Incorrect code.");
    }
  };

  const handleOnCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
  };

  const submitCode = async (address) => {
    const signedSessionToken = await getSignedSession(address);
    return NodeApi.confirmTvLogin(code, address, signedSessionToken);
  };

  const getSignedSession = async (address) => {
    const epoch = Date.now(); // Unix timestamp in milliseconds
    var sessionToken = epoch + address;
    const signature = await MetamaskUtil.signTypedData(sessionToken);
    return epoch + "_" + signature;
  };

  return (
    <div className="tv-login">
      {isResolved === true ? (
        <div className="tv-success tv-height">
          <h1 className="tv-success-text">{connectResponse}</h1>
          <p className="tv-app-text">Troubles? Please refresh and try again.</p>
        </div>
      ) : (
        <div className="tv-height">
          {" "}
          <h1 className="tv-title">
            Enter 6 digit code from the TV App to Sign in.
          </h1>
          <p className="tv-meta">Requires Metamask for wallet verification.</p>
          <div className="tv-code">
            <input
              id="code"
              autoComplete="off"
              className="pin-input"
              placeholder="Please enter code here"
              value={code.toUpperCase()}
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

      {connectResponse === true ? (
        <div className="tv-success tv-height">
          <h1 className="tv-success-text">Login Failed! Incorrect code.</h1>
          <p className="tv-app-text">Please refresh and try again.</p>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
