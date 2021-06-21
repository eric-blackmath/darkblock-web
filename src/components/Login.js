import React from "react";


//Logs user into metamask and fetches their account address
export default function Login({ setAddress }) {
  
const getAccount = async () => {

  const ethereum = window.ethereum;
  ethereum.request({ method: "eth_requestAccounts" });

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];  
  setAddress(account) //when address is set, user is redirected to dashboard 
}

    return (
      <div>
        <button onClick={getAccount} className="enableEthereumButton">Enable Ethereum</button>
        <h2>
          Account: {setAddress}
        </h2>
      </div>
    );
  }


