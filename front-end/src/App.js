import React, { useState } from "react";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  const [address, setAddress] = useState();

  //if no address, user cannot access dashboard
  if (!address) {
    return <Login setAddress={setAddress} />;
  }

  return (
    <div className="container">
      <Nav />
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard address={address} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
