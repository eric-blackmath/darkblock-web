import React from "react";

class Meta extends React.Component {
  componentDidMount() {
    const ethereum = window.ethereum;

    const ethereumButton = document.querySelector(".enableEthereumButton");
    const showAccount = document.querySelector(".showAccount");

    async function getAccount() {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      showAccount.innerHTML = account;
    }

    ethereumButton.addEventListener("click", () => {
      getAccount();
    });

    ethereum.request({ method: "eth_requestAccounts" });
  }

  render() {
    return (
      <div>
        <button className="enableEthereumButton">Enable Ethereum</button>
        <h2>
          Account: <span className="showAccount"></span>
        </h2>
      </div>
    );
  }
}

export default Meta;
