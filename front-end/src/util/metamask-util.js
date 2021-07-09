import Web3 from "web3";
// A JS library for recovering signatures:
import * as sigUtil from "eth-sig-util";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");

export async function signTypedData(data, address) {
  const typedData = [
    {
      type: "string",
      name: "Message",
      value: data,
    },
  ];

  return web3.currentProvider.send(
    {
      method: "eth_signTypedData",
      params: [typedData, address],
    },
    function (err, result) {
      if (err) return console.error(err);
      if (result.error) {
        return result.error.message;
      }
      return result.result;
    }
  );
}

export async function signData(data, address) {
  let signature = await new Promise((resolve, reject) => {
    web3.eth.sign(data, address, function (err, result) {
      if (err) return reject(err);
      console.log(`Result : ${result}`);
      return resolve(result);
    });
  });
  return signature;
}
