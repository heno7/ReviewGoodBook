const express = require("express");
const router = express.Router();

const { world } = require("../../controllers/world");

const { checkUser } = require("../../auth/checkAuth");

router.get("/", checkUser, world.getWorld);

module.exports = router;
