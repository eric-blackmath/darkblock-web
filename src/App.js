import React, { Component } from "react";

import Meta from "../src/components/meta";
import Axios from "../src/components/axios";


class App extends Component {
  render() {
    return (
      <div className="container">
        <Meta />
        <Axios />
      </div>
    );
  }
}

export default App;
