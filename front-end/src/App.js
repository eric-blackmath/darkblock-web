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
import { BrowserRouter } from "react-router-dom";

function App() {
  const [address, setAddress] = useState();

  // const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  //if no address, user cannot access dashboard
  if (!address) {
    if (localStorage.getItem("accountAddress")) {
      setAddress(localStorage.getItem("accountAddress"));
    }
  }

  return (
    <div className="App">
      {address ? <Nav setAddress={setAddress} /> : null}

      <div className="content">
        <BrowserRouter>
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

              <Route exact path="/home">
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
                path="/nfts/createdbyme:account"
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
                <Tv />
              </Route>
            </UserContext.Provider>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
