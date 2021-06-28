import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
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
    return <Login setAddress={setAddress} setUser={setUser} />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <div className="content">
          <Switch>
            <UserContext.Provider value={user}>
              <Route exact path="/dashboard">
                <Dashboard address={address} />
              </Route>

              <Route path="/details/:id">
                <DetailsView />
              </Route>
            </UserContext.Provider>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
