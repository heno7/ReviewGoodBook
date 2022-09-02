const express = require("express");
const router = express.Router();
const path = require("path");

const { checkUser } = require("../auth/checkAuth");

router.get("/", checkUser, (req, res) => {
  res.render("index", {
    userName: req.user.userName,
  });
});

module.exports = router;
