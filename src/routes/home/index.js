const express = require("express");
const home = express.Router();

const { checkUser } = require("../../auth/checkAuth");
const { homeController } = require("../../controllers/home/index");

home.get("/", checkUser, homeController.getHome);

const reviews = require("./reviews");
const discussions = require("./discussions");

module.exports = {
  home,
  reviews,
  discussions,
};
