import React from "react";
import wallet from "../images/wallet.svg";
import * as MetamaskUtil from "../util/metamask-util";
import * as LoginUtil from "../util/login-util";
import { useHistory } from "react-router-dom";
import "../styles/home.scss";
import hands from "../images/hands.png";
import goldblock from "../images/goldblock.png";
import silverblock from "../images/silverblock.png";
import tvimage from "../images/tvimage.png";
import Footer from "../components/footer";

//Logs user into metamask and fetches their account address
export default function Home({ setAddress }) {

  let history = useHistory();

  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const address = await MetamaskUtil.signInAndGetAccount();
    if (address) {
      setAddress(address); //when address is set, user is redirected to dashboard
      LoginUtil.keepUserLoggedIn(address);
      redirectToNFts();
    }
  };

  const redirectToNFts = () => {
    history.push("/nfts/created");
  };

  return (
    <div>
      <div className="home-page ">
        <div className="home-hero home-container">
          <div>
            <h1 className="home-title">Give superpowers to your NFTs!</h1>
            <p className="for-free">
              (for free)<span>*</span>
            </p>
            <div className="login-container">
              <button onClick={getAccount} className="login-button">
                <img className="wallet-icon" src={wallet} alt="wallet icon" />
                <span style={{ paddingTop: "3px" }}>Connect Wallet</span>
              </button>
            </div>
          </div>
          <div>
            <img className="hands-image" src={hands} alt="hands" />
          </div>
          <div className="arweave-warning">
            <p>
              *Uploading to Arweave isn’t free. But we’ve got you covered for
              now.
            </p>
          </div>
        </div>
        <div className="level-container">
          <div className="choose-level">
            <div>
              <h1 className="level-title">
                Choose between two levels of Darkblocks
              </h1>
            </div>
            <div className="level-grid">
              <div>
                <div
                  style={{ display: "block", margin: "auto", width: "60%" }}
                  className="upgrade-level"
                >
                  <p className="upgrade-number">LEVEL 1</p>
                </div>
                <div className="upgrade-title">
                  <span className="upgrade-type">Supercharged</span>
                  <ul className="upgrade-detail-list">
                    <li>Large filesize support (350MB)</li>
                    <li>Stored forever on Arweave</li>
                  </ul>
                </div>
                <img className="blocks" src={silverblock} alt="block" />
              </div>
              <div>
                <div
                  style={{ display: "block", margin: "auto", width: "60%" }}
                  className="upgrade-level"
                >
                  <p className="upgrade-number">LEVEL 2</p>
                </div>
                <div className="upgrade-title">
                  <span className="upgrade-type">Protected by Darkblock</span>
                  <ul className="upgrade-detail-list">
                    <li>Darkblock encryption</li>
                    <li>All features of level 1</li>
                  </ul>
                </div>
                <img className="blocks" src={goldblock} alt="block" />
              </div>
            </div>
          </div>
        </div>

        <div className="tv-container">
          <div className="tv-info">
            <img className="tv-image" src={tvimage} alt="tv" />
            <div className="text-block">
              <h1 className="tv-home-title">
                View your Darkblocks on the big screen along with all your other
                NFTs
              </h1>
              <p>
                Download the Darkblock Android TV app to decrypt and display
                your Darkblocks.
                <span className="tv-link">
                  This is a link to the TV app store
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
