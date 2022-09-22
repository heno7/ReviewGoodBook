const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");

const { checkUser } = require("../auth/checkAuth");

const {
  generateWorldSearchKey,
  generateHomeSearchKey,
} = require("../search/search");

router.get("/", checkUser, async (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

router.get("/search-API-key", checkUser, (req, res) => {
  const worldSearchAPIKey = generateWorldSearchKey();

  if (req.user) {
    const homeSearchAPIKey = generateHomeSearchKey(req.user.id);
    return res.status(200).json({
      worldSearchAPIKey,
      homeSearchAPIKey,
    });
  }

  return res.status(200).json({
    worldSearchAPIKey,
  });
});

module.exports = router;
