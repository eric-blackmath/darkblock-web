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
import seoimage from "./images/logo512.png";
function App() {
  const [address, setAddress] = useState();
  let history = useHistory();

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
      <img src={seoimage} alt="seo" style={{ display: "none" }} />
      <Nav setAddress={setAddress} address={address} />
      <div className="content">
        <Switch>
          <UserContext.Provider value={address}>
            <Route
              exact
              path="/nfts/collected"
              render={() => (address ? <MyNfts /> : <Redirect to="/" />)}
            ></Route>

            <Route
              exact
              path="/nfts/collected/:account"
              render={() => (address ? <MyNfts /> : <Redirect to="/" />)}
            ></Route>

            <Route
              exact
              path="/"
              render={() =>
                address ? (
                  <Redirect to="/nfts/created" />
                ) : (
                  <Home setAddress={setAddress} />
                )
              }
            ></Route>

            <Route
              exact
              path="/nfts/created"
              render={() => (address ? <CreatedByMe /> : <Redirect to="/" />)}
            ></Route>

            <Route
              exact
              path="/nfts/created/:account"
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
