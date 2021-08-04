const express = require("express");
const router = express.Router();
const mainController = require("../controller/main.controller");
const tvLoginController = require("../controller/tv-login.controller");
const bodyParser = require("body-parser");

let routes = (app) => {
  router.post("/upload", mainController.upload);
  router.get("/files", mainController.getListFiles);
  router.get("/files/:name", mainController.download);
  router.post("/verify", mainController.verifyNFTs);
  router.post("/verify-id", mainController.verifyNFT);
  router.post("/verify-sig", mainController.verifySignature);
  router.get("/protocol", mainController.protocolTest);

  app.use(bodyParser.urlencoded({ extended: true }));
  router.post("/protocolUpload", mainController.protocolUpload);

  router.get("/codepollar/:code", tvLoginController.tvLoginCodePollar);
  router.post("/codeset", tvLoginController.tvLoginCodeSet);

  app.use(router);
};

module.exports = routes;
