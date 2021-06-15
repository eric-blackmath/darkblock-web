import React, {Component} from "react";
// import MetaMaskLoginButton from 'react-metamask-login-button';

import Meta from "../src/components/meta";
import Users from "../src/components/rarible";
import Image from "../src/components/image";
import Axios from "../src/components/axios";
// import Form from "../src/components/form";
// import ImagePreview from "../src/components/imagePreview";

// import Contacts from './components/contacts'

class App extends Component {
  render() {
    return (
      <div className="container">
      <Meta />
      {/* <ImagePreview /> */} 
      <Axios />
      {/* <Image /> */}
      {/* <Form /> */}
    </div>
      // <Contacts contacts={this.state.contacts} />
    )
  }
}

export default App