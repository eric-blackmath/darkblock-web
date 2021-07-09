const express = require("express");
const router = express.Router();
const controller = require("../controller/main.controller");
const bodyParser = require("body-parser");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.post("/verify", controller.verifyNFTs);
  router.post("/verify-sig", controller.verifySignature);
  router.get("/protocol", controller.protocolTest);

  app.use(bodyParser.urlencoded({ extended: true }));
  router.post("/protocolUpload", controller.protocolUpload);

  app.use(router);
};

module.exports = routes;
