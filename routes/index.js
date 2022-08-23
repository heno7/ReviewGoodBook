const express = require("express");
const router = express.Router();

const { checkUser } = require("../Auth/checkAuth");

router.get("/", checkUser, (req, res) => {
  res.render("index", { userName: req.user.userName });
});

module.exports = router;
