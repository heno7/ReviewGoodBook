const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");

const { checkUser } = require("../auth/checkAuth");

router.get("/", checkUser, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("index", {
    user: req.user,
  });
});

module.exports = router;
