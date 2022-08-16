const express = require("express");
const router = express.Router();

const { checkUser } = require("../../Auth/checkAuth");
const { home } = require("../../controllers/home");

router.get("/", checkUser, home.getHome);

module.exports = router;
