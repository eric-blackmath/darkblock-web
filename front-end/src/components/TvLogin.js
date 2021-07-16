import React from "react";
import "../App.scss";
import "../styles/tv.scss";
import { UserContext } from "../util/UserContext";
import { useState, useEffect, useContext } from "react";
import * as DarkblockApi from "../api/darkblock-api";
import * as MetamaskUtil from "../util/metamask-util";
import Footer from "../components/footer";

export default function TvLogin({ address }) {
  // const address = useContext(UserContext);
  const [code, setCode] = useState("");
  const [isConnectSuccess, setIsConnectSuccess] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    console.log(`Tv login triggered : ${address}`);
    checkIfUserLoggedIn();
  }, [address]);

  const checkIfUserLoggedIn = () => {
    if (!address) {
      console.log(`User set to logged Out`);
      setIsUserLoggedIn(false);
    } else {
      console.log(`User set to logged In`);
      setIsUserLoggedIn(true);
    }
  };
  const onSubmit = async () => {
    try {
      checkIfUserLoggedIn();

      console.log(`Address : ${address} : ${isUserLoggedIn}`);

      var submitResponse;

      if (isUserLoggedIn === false) {
        //make him login, then send the code
        alert("Please make sure you are logged in first");
      } else {
        submitResponse = await submitCode(address);

        if (submitResponse.status === 200) {
          //code submitted succesfully
          setIsConnectSuccess(true);
          console.log(`Code Submitted, Redirecting you somewhere`);
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
    console.log(`Address : ${address}`);
    return DarkblockApi.confirmTvLogin(code, address, signedSessionToken);
  };

  const getSignedSession = async (address) => {
    const epoch = Date.now(); // Unix timestamp in milliseconds
    var sessionToken = epoch + address;
    console.log(`Session  : ${sessionToken}`);
    const signature = await MetamaskUtil.signTypedData(sessionToken);
    console.log(`Signature : ${signature}`);
    return epoch + "_" + signature;
  };

  return (
    <div className="tv-login">
      {isConnectSuccess ? (
        <div className="tv-success">
          <h1 className="tv-success-text">
            Sweet!<br></br> You have successfully been connected.
          </h1>
          <p className="tv-app-text">You can now continue on your TV app.</p>
        </div>
      ) : (
        <div>
          {" "}
          <h1 className="tv-title">Enter TV code and connect</h1>
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
