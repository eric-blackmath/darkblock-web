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
      <Nav setAddress={setAddress} address={address} />
      <div className="content">
        <Switch>
          <UserContext.Provider value={address}>
            <Route
              exact
              path="/nfts/all"
              render={() => (address ? <MyNfts /> : <Redirect to="/home" />)}
            ></Route>

            <Route
              exact
              path="/nfts/all/:account"
              render={() => (address ? <MyNfts /> : <Redirect to="/home" />)}
            ></Route>

            <Route exact path="/">
              <Home setAddress={setAddress} />
            </Route>

            <Route
              exact
              path="/nfts/createdbyme"
              render={() =>
                address ? <CreatedByMe /> : <Redirect to="/home" />
              }
            ></Route>

            <Route
              exact
              path="/nfts/createdbyme/:account"
              render={() =>
                address ? <CreatedByMe /> : <Redirect to="/home" />
              }
            ></Route>

            <Route
              path="/details/:contract/:token"
              render={() =>
                address ? <DetailsView /> : <Redirect to="/home" />
              }
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
