import Web3 from "web3";
// A JS library for recovering signatures:
import * as sigUtil from "eth-sig-util";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");

export async function signData(data, address) {
  // var msgHash = ethUtil.keccak256(msgParams);

  // web3.eth.personal_sign(from, msgHash, function (err, result) {
  //   if (err) return console.error(err);
  //   console.log("SIGNED:" + result);
  // });

  const msgParamsLocal = [
    {
      type: "string", // Any valid solidity type
      name: "Message", // Any string label you want
      value: data, // The value to sign
    },
  ];

  // var msgHash = ethUtil.keccak256(Buffer.from(msgParams));
  // var msgHash = Buffer.from(
  //   "8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede",
  //   "hex"
  // );

  // console.log(from + msgParams + msgHash);

  // let signature1 = await new Promise((resolve, reject) => {
  //   web3.eth.sign(msgParams, from, function (err, result) {
  //     if (err) return reject(err);
  //     console.log(`Result : ${result}`);
  //     return resolve(result);
  //   });
  // });

  // console.log(`Sig : ${signature1}`);

  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Person",
    domain: {
      name: "Person chat",
      version: "1",
      chainId: 1,
    },
    message: {
      name: "Testing",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
  };

  //   const res = sigUtil.signTypedData(address, { data: typedData });

  //   console.log(`${JSON.stringify(res)}`);

  // const signature = await web3.eth.sign(address, text = data);
  console.log(`${address}`);
  const signature = await web3.eth.sign(
    web3.utils.sha3(data),
    address,
    function (err, result) {
      console.log(err, result);
    }
  );
  console.log(`eth.sign : ${signature}`);

  return signature;

  // return web3.currentProvider.send(
  //   {
  //     method: "eth_signTypedData",
  //     params: [msgParamsLocal, address],
  //   },
  //   function (err, result) {
  //     if (err) return console.error(err);
  //     if (result.error) {
  //       return console.error(result.error.message);
  //     }

  //     return result.result;

  //     //   return JSON.stringify(result);
  //     // const recovered = sigUtil.recoverTypedSignature({
  //     //   data: msgParamsLocal,
  //     //   sig: result.result,
  //     // });
  //     // if (recovered === address) {
  //     //   alert("Recovered signer: " + address);
  //     // } else {
  //     //   alert("Failed to verify signer, got: " + result);
  //     // }
  //   }
  // );
}
