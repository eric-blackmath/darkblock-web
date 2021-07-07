import React, { useState } from "react";
import Login from "./components/Login";
import MyNfts from "./components/MyNfts";
import CreatedByMe from "./components/CreatedByMe";
import Tv from "./components/TvLogin";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import DetailsView from "./components/Details";
import Nav from "./components/Nav";
import { UserContext } from "./util/UserContext";

function App() {
  const [address, setAddress] = useState();
  const [user, setUser] = useState(null);
  // const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  //if no address, user cannot access dashboard
  if (!address) {
    if (!localStorage.getItem("accountAddress")) {
      return <Login setAddress={setAddress} setUser={setUser} />;
    }
    setAddress(localStorage.getItem("accountAddress"));
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <div className="content">
          <Switch>
            <UserContext.Provider value={address}>
              <Route exact path="/nfts/all">
                <MyNfts />
              </Route>

              <Route exact path="/nfts/all/:account">
                <MyNfts />
              </Route>

              <Route exact path="/nfts/createdbyme">
                <CreatedByMe />
              </Route>

              <Route path="/details/:contract/:token">
                <DetailsView />
              </Route>
              <Route exact path="/tv">
                <Tv />
              </Route>
            </UserContext.Provider>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
