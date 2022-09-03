const express = require("express");
const world = express.Router();

const { worldController } = require("../../controllers/world");

const { checkUser } = require("../../auth/checkAuth");

world.get("/", checkUser, worldController.getWorld);

const reviews = require("./reviews");

const discussions = require("./discussions");

module.exports = {
  world,
  reviews,
  discussions,
};
