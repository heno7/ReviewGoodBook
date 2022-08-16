const express = require("express");
const router = express.Router();

const { world } = require("../../controllers/world");

router.get("/", world.getWorld);

module.exports = router;
