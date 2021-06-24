const express = require("express");
const router = express.Router();
const controller = require("../controller/main.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.post("/verify", controller.verifyNFTs);

  app.use(router);
};

module.exports = routes;
