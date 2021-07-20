import React, { useState } from "react";
import Home from "./components/Home";
import MyNfts from "./components/MyNfts";
import CreatedByMe from "./components/CreatedByMe";
import Tv from "./components/TvLogin";
import { Route, Switch } from "react-router-dom";
import DetailsView from "./components/Details";
import Nav from "./components/Nav";
import { UserContext } from "./util/UserContext";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

function App() {
  const [address, setAddress] = useState();
  let history = useHistory();

  // const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  const redirectToCreatedByMe = () => {
    history.push("/nfts/createdbyme");
  };

  //if no address, user cannot access dashboard
  if (!address) {
    if (localStorage.getItem("accountAddress")) {
      //if logged in redirect to createdbyme
      setAddress(localStorage.getItem("accountAddress"));
      // redirectToCreatedByMe();
    }
  }

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Darkblock</title>
        {/* Google SEO  */}
        <meta name="title" content="Darkblock" />
        <meta
          name="description"
          content="The Darkblock web app gives superpowers to your NFTs. With Darkblock you can now attach an encrypted file to your pre-existing NFT that only the NFT owner can decrypt. To decrypt and display the Darkblock download the Darkblock Android TV app."
        />
        <meta name="keywords" content="" />
        {/* <meta name="robots" content="index, follow" /> */}
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        {/* Facebook SEO  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://app.darkblock.io" />
        <meta property="og:title" content="Darkblock" />
        <meta
          property="og:description"
          content="The Darkblock web app gives superpowers to your NFTs. With Darkblock you can now attach an encrypted file to your pre-existing NFT that only the NFT owner can decrypt. To decrypt and display the Darkblock download the Darkblock Android TV app."
        />
        <meta property="og:image" content="./images/logo512.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="http://app.darkblock.io" />
        <meta property="twitter:title" content="Darkblock" />
        <meta
          property="twitter:description"
          content="The Darkblock web app gives superpowers to your NFTs. With Darkblock you can now attach an encrypted file to your pre-existing NFT that only the NFT owner can decrypt. To decrypt and display the Darkblock download the Darkblock Android TV app."
        />
        <meta property="twitter:image" content="./images/logo512.png"></meta>
      </Helmet>
      <Nav setAddress={setAddress} address={address} />
      <div className="content">
        <Switch>
          <UserContext.Provider value={address}>
            <Route
              exact
              path="/nfts/all"
              render={() => (address ? <MyNfts /> : <Redirect to="/" />)}
            ></Route>

            <Route
              exact
              path="/nfts/all/:account"
              render={() => (address ? <MyNfts /> : <Redirect to="/" />)}
            ></Route>

            <Route
              exact
              path="/"
              render={() =>
                address ? (
                  <Redirect to="/nfts/createdbyme" />
                ) : (
                  <Home setAddress={setAddress} />
                )
              }
            ></Route>

            <Route
              exact
              path="/nfts/createdbyme"
              render={() => (address ? <CreatedByMe /> : <Redirect to="/" />)}
            ></Route>

            <Route
              exact
              path="/nfts/createdbyme/:account"
              render={() => (address ? <CreatedByMe /> : <Redirect to="/" />)}
            ></Route>

            <Route
              path="/details/:contract/:token"
              render={() => (address ? <DetailsView /> : <Redirect to="/" />)}
            ></Route>

            <Route exact path="/tv">
              <Tv address={address} />
            </Route>
          </UserContext.Provider>
        </Switch>
      </div>
    </div>
  );
}

export default App;
