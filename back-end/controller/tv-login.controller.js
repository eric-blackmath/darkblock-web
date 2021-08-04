const DELAY = 1000;
var connections = new Map();
const CONNECTION_EXPIRATION = 300000; //5 minutes

/**
 * @param  {request} req //request with code in the url param
 * @param  {} res
 * add unique connections to the map
then loop through each connection in a setTimeOut method and check if the code is success
if not success then the user hasnt entered the code correctly and the code will expire after 5 minutes
 */
const tvLoginCodePollar = async (req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  var code = req.params.code;

  var connection = {
    code: "waiting",
    connection: res,
    wallet: "",
    signature: "",
    expiration: Date.now() + CONNECTION_EXPIRATION,
  };

  if (connections.has(code) === false) {
    connections.set(code, connection);
    console.log(
      `New Connection Added : ${code} | Connections : ${connections.size}`
    );
  }

  setTimeout(function run() {
    for (const [key, value] of connections.entries()) {
      console.log(`Connection ${key} is waiting`);

      //set expiration for connections, since we dont have a failed state
      if (connections.get(key).expiration < Date.now()) {
        const connection = connections.get(key);
        console.log(`Connection Expired`);
        connection.connection.send({
          wallet: "null",
          message: "Connection Expired",
        });
        connection.connection.end();
        connections.delete(key);
        continue;
      }

      if (connections.get(key).code === "success") {
        //we got success for a connection, send back the response, and close the connection
        const connection = connections.get(key);
        connection.connection.send({
          wallet: connection.wallet,
          signature: connection.signature,
        });
        connection.connection.end();
        connections.delete(key);
        console.log(`Connection ${key} is resolved`);
      }
    }

    if (connections.size > 0) {
      setTimeout(run, DELAY);
    }
  }, DELAY);
};

/**
 * @param  {request} req //request with code, wallet, signature in the params
 * @param  {} res
 * takes the code from params and checks if we have a match in our connections
 */
const tvLoginCodeSet = async (req, res) => {
  const code = req.body.code;
  const wallet = req.body.wallet;
  const session_token = req.body.session_token; //need to separate the signature and verify
  var isLoginSuccessful = false;

  if (connections !== undefined && connections.size > 0) {
    if (connections.has(code)) {
      if (connections.get(code).code === "waiting") {
        //we have an entry, we check for success or fail here
        isLoginSuccessful = true;
        connections.get(code).code = "success";
        connections.get(code).wallet = wallet;
        connections.get(code).signature = session_token;
      }
    }
  }

  if (isLoginSuccessful === true) {
    res.status(200).send({
      message: `Login Successful`,
    });
  } else {
    console.log(`Failed Attempt`);
    res.status(401).send({ error: `Login Failed! Incorrect code` });
  }
};

// Export all ya need
module.exports = {
  tvLoginCodePollar,
  tvLoginCodeSet,
};
